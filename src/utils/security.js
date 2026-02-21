// ─── DateWithMe Security Utils ───────────────────────────────────────────────
// Centraliza todas as validações de segurança da app

// ── Fix 6: Validação segura de hostname de URL ─────────────────────────────
// Usa endsWith para evitar bypass com domínios como "evil-giphy.com"
const SAFE_GIF_DOMAINS = ['giphy.com', 'tenor.com', 'imgur.com', 'media.tenor.com'];

export function isSafeGifUrl(url) {
    if (!url) return true; // URL vazia é OK (campo ainda a ser preenchido)
    try {
        const { hostname } = new URL(url);
        return SAFE_GIF_DOMAINS.some(
            (d) => hostname === d || hostname.endsWith('.' + d)
        );
    } catch {
        return false; // URL inválida enquanto escreve — não bloquear ainda
    }
}

export function validateAndSetGifUrl(url, setter) {
    if (!url) { setter(url); return; }
    try {
        const { hostname } = new URL(url);
        const safe = SAFE_GIF_DOMAINS.some(
            (d) => hostname === d || hostname.endsWith('.' + d)
        );
        if (!safe) {
            alert('Por segurança, usa apenas links do Giphy, Tenor ou Imgur.');
            return;
        }
    } catch {
        // URL ainda incompleta enquanto o utilizador escreve — aceitar silenciosamente
    }
    setter(url);
}

// ── Fix 3: Validação de magic bytes para uploads de imagem ────────────────
// O file.type é controlado pelo cliente e pode ser falsificado.
// Lemos os primeiros bytes do ficheiro para confirmar o tipo real.
const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB

const MAGIC_BYTES = {
    'image/jpeg': [[0xFF, 0xD8, 0xFF]],
    'image/png':  [[0x89, 0x50, 0x4E, 0x47]],
    'image/gif':  [[0x47, 0x49, 0x46, 0x38]],
    'image/webp': [[0x52, 0x49, 0x46, 0x46]], // RIFF....WEBP — verificamos RIFF
};

function checkMagicBytes(buffer, mime) {
    const bytes = new Uint8Array(buffer);
    const signatures = MAGIC_BYTES[mime];
    if (!signatures) return false;
    return signatures.some((sig) => sig.every((b, i) => bytes[i] === b));
}

/**
 * Valida um ficheiro de imagem (tamanho, MIME declarado e magic bytes).
 * Devolve Promise<string | null>:
 *   - string com mensagem de erro se inválido
 *   - null se válido
 */
export function validateImageFile(file) {
    return new Promise((resolve) => {
        if (!file) { resolve(null); return; }

        if (!ALLOWED_MIME.includes(file.type)) {
            resolve('Apenas imagens (JPG, PNG, GIF, WEBP) são permitidas.');
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            resolve('O ficheiro é demasiado grande. Máximo 2MB.');
            return;
        }

        // Ler os primeiros 12 bytes para verificar magic bytes
        const reader = new FileReader();
        reader.onload = (e) => {
            const valid = checkMagicBytes(e.target.result, file.type);
            if (!valid) {
                resolve('Ficheiro inválido. O conteúdo não corresponde ao tipo de imagem declarado.');
            } else {
                resolve(null); // OK
            }
        };
        reader.onerror = () => resolve('Erro ao ler o ficheiro.');
        reader.readAsArrayBuffer(file.slice(0, 12));
    });
}

// ── Fix 4: Rate limiting no frontend ─────────────────────────────────────
// Previne spam de submissões (invites, respostas) por parte de bots ou utilizadores abusivos.
// Usa uma chave em sessionStorage para manter o estado entre renders.

const RATE_LIMITS = {
    create_invite:   { max: 5,  windowMs: 10 * 60 * 1000 }, // 5 invites por 10 min
    submit_response: { max: 3,  windowMs: 5  * 60 * 1000 }, // 3 respostas por 5 min
};

/**
 * Verifica se a ação está dentro do rate limit.
 * @param {string} action - chave da ação (ex: 'create_invite')
 * @returns {{ allowed: boolean, waitSeconds?: number }}
 */
export function checkRateLimit(action) {
    const config = RATE_LIMITS[action];
    if (!config) return { allowed: true };

    const key = `rl_${action}`;
    const now = Date.now();

    let record;
    try {
        record = JSON.parse(sessionStorage.getItem(key) || 'null');
    } catch {
        record = null;
    }

    // Inicializar ou resetar janela expirada
    if (!record || now - record.windowStart > config.windowMs) {
        record = { windowStart: now, count: 0 };
    }

    if (record.count >= config.max) {
        const waitMs = config.windowMs - (now - record.windowStart);
        const waitSeconds = Math.ceil(waitMs / 1000);
        return { allowed: false, waitSeconds };
    }

    // Incrementar contador
    record.count += 1;
    try {
        sessionStorage.setItem(key, JSON.stringify(record));
    } catch {
        // sessionStorage pode estar desativado — falhar de forma segura
    }

    return { allowed: true };
}
