import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { Loader2, Heart, Calendar, Clock, MapPin, Star, MessageSquare } from 'lucide-react';

export default function Result() {
    const { id } = useParams();
    const [searchParams] = useSearchParams();

    const [invite, setInvite] = useState(null);
    const [responses, setResponses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Obter a chave: primeiro da URL (?key=), depois do localStorage
    const [key, setKey] = useState(() => {
        const urlKey = searchParams.get('key');
        const storedKey = localStorage.getItem(`ck_${id}`);

        if (urlKey) {
            // Guardar no localStorage e limpar a URL (chave não deve ficar exposta)
            localStorage.setItem(`ck_${id}`, urlKey);
            window.history.replaceState({}, '', `/resultado/${id}`);
            return urlKey;
        }
        return storedKey;
    });

    useEffect(() => {
        const urlKey = searchParams.get('key');
        if (urlKey) {
            localStorage.setItem(`ck_${id}`, urlKey);
            setKey(urlKey);
            window.history.replaceState({}, '', `/resultado/${id}`);
        }
    }, [id, searchParams]);

    useEffect(() => {
        async function fetchData() {
            if (!key) {
                setError('Acesso negado. Precisas da chave de criador.');
                setLoading(false);
                return;
            }

            setLoading(true);

            // 1. Fetch invite info via RPC get_safe_invite (more reliable + filters data)
            const { data: inviteDataArray, error: inviteError } = await supabase
                .rpc('get_safe_invite', { p_invite_id: id });

            if (inviteError || !inviteDataArray || inviteDataArray.length === 0) {
                // Fallback to view just in case
                const { data: viewData, error: viewError } = await supabase
                    .from('invites_public')
                    .select('id, content, status, created_at')
                    .eq('id', id)
                    .single();

                if (viewError || !viewData) {
                    setError('Invite não encontrado ou acesso restrito.');
                    setLoading(false);
                    return;
                }
                setInvite(viewData);
            } else {
                setInvite(inviteDataArray[0]);
            }

            // 2. Fetch responses via secure RPC (validates key on server)
            const { data: respData, error: respError } = await supabase
                .rpc('get_invite_results', {
                    invite_uuid: id,
                    p_key: key
                });

            if (respError) {
                console.error('RPC Error:', respError);
                setError('Não foi possível carregar as respostas. Verifica se tens a chave correta.');
                setLoading(false);
                return;
            }

            setResponses(respData || []);
            setLoading(false);
        }
        if (id && key) fetchData();
        else if (id && !key) {
            setLoading(false);
            setError('Acesso negado. Chave de criador necessária.');
        }
    }, [id, key]);

    if (loading) return (
        <div className="min-h-screen bg-pink-50 flex items-center justify-center">
            <Loader2 className="animate-spin text-pink-500" size={48} />
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-pink-50 flex items-center justify-center text-center p-6">
            <div className="max-w-md bg-white p-8 rounded-3xl shadow-xl">
                <h1 className="text-4xl mb-4">🚫</h1>
                <p className="text-gray-600 font-bold mb-6">{error}</p>
                <button onClick={() => window.location.href = '/'} className="bg-pink-500 text-white px-6 py-2 rounded-full font-bold">Voltar à Home</button>
            </div>
        </div>
    );

    const isSurprise = invite?.content?.templateId === 'surprise';

    return (
        <div className="min-h-screen bg-pink-50 font-sans pb-20">
            {/* Header / Stats */}
            <div className="bg-white px-6 py-12 text-center space-y-4 shadow-sm border-b border-pink-100">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart size={32} className="text-pink-500 fill-pink-500 animate-pulse" />
                </div>
                <h1 className="text-3xl font-black text-gray-800 uppercase tracking-tight">RESPOSTAS DO CONVITE</h1>
                <div className="flex justify-center gap-6">
                    <div className="text-center">
                        <p className="text-2xl font-black text-pink-500">{responses.length}</p>
                        <p className="text-[10px] font-black text-gray-400 uppercase">Respostas</p>
                    </div>
                </div>
            </div>

            <main className="max-w-lg mx-auto p-6 space-y-8">
                {responses.length === 0 ? (
                    <div className="text-center py-20 space-y-4">
                        <p className="text-4xl">🏜️</p>
                        <p className="text-gray-400 font-bold">Ainda ninguém respondeu...</p>
                        <p className="text-xs text-gray-400">Envia o link e as respostas aparecerão aqui em tempo real!</p>
                    </div>
                ) : (
                    responses.map((resp, idx) => {
                        const ans = resp.answers || {};
                        const decisao = resp.decisao; // 'sim' | 'nao'

                        return (
                            <motion.div
                                key={resp.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white rounded-[2rem] p-8 shadow-xl border border-white overflow-hidden relative"
                            >
                                {/* Decision Badge */}
                                <div className={`absolute top-0 right-0 px-6 py-2 rounded-bl-3xl font-black text-xs uppercase tracking-widest ${decisao === 'sim' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                    {decisao === 'sim' ? 'Disseram SIM! 🎉' : 'Disseram Não 💔'}
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1 h-8 bg-pink-500 rounded-full" />
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Resposta #{responses.length - idx}</p>
                                    </div>

                                    {decisao === 'sim' && (
                                        <div className="space-y-6">
                                            {/* Surprise Mode Specific Rendering */}
                                            {isSurprise ? (
                                                <div className="bg-pink-50 p-6 rounded-2xl flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-pink-500">
                                                            <Calendar size={24} />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-black text-gray-800 uppercase tracking-wider">
                                                                {ans.chosen_date ? new Date(ans.chosen_date + 'T00:00:00').toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'Data não definida'}
                                                            </p>
                                                            <p className="text-[10px] font-black text-pink-400 uppercase">
                                                                {ans.chosen_time || 'Horário não definido'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    {/* Original Quiz Rendering */}
                                                    {ans['step_date']?.date && (
                                                        <div className="bg-pink-50 p-6 rounded-2xl flex items-center justify-between">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-pink-500">
                                                                    <Calendar size={24} />
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-black text-gray-800 uppercase tracking-wider">
                                                                        {new Date(ans['step_date'].date + 'T00:00:00').toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                                                    </p>
                                                                    <p className="text-[10px] font-black text-pink-400 uppercase">
                                                                        {ans['step_date'].startTime} - {ans['step_date'].endTime}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="grid grid-cols-1 gap-3">
                                                        {Object.entries(ans).map(([k, val]) => {
                                                            if (k === 'step_date') return null;
                                                            const step = invite?.content?.steps?.find(s => s.id === k);
                                                            if (!step) return null;

                                                            return (
                                                                <div key={k} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                                                    <div className="flex items-center gap-3 text-left">
                                                                        <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{step.title}</span>
                                                                    </div>
                                                                    <span className="text-sm font-black text-gray-800 text-right">
                                                                        {(() => {
                                                                            if (typeof val === 'string') return val;
                                                                            if (typeof val === 'number') return `${val} ⭐`;
                                                                            if (Array.isArray(val)) return val.join(', ');
                                                                            if (val && typeof val === 'object') return val.label || 'Opção selecionada';
                                                                            return String(val);
                                                                        })()}
                                                                    </span>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    )}

                                    <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-[10px] text-gray-300 font-bold uppercase tracking-widest">
                                        <span>Recebido em: {new Date(resp.created_at).toLocaleString('pt-PT')}</span>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </main>
        </div>
    );
}
