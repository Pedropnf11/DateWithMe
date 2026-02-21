import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';

export default function Terms() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-pink-50 font-sans p-6 md:p-12 selection:bg-pink-500 selection:text-white">
            <div className="max-w-3xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-pink-500 font-black text-xs uppercase tracking-widest mb-8 hover:gap-3 transition-all"
                >
                    <ArrowLeft size={16} /> Voltar à Home
                </button>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-white"
                >
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center text-pink-500">
                            <FileText size={24} />
                        </div>
                        <h1 className="text-3xl font-black text-gray-800 uppercase tracking-tighter">Termos de Uso</h1>
                    </div>

                    <div className="space-y-6 text-gray-600 leading-relaxed font-medium">
                        <p className="text-sm italic">Última atualização: 21 de Fevereiro de 2026</p>

                        <section className="space-y-3">
                            <h2 className="text-xl font-bold text-gray-800">1. Termos</h2>
                            <p>
                                Ao acessar ao site <strong>DateWithMe</strong>, concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis e concorda que é responsável pelo cumprimento de todas as leis locais aplicáveis. Se você não concordar com algum desses termos, está proibido de usar ou acessar este site.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-bold text-gray-800">2. Uso de Licença</h2>
                            <p>
                                É concedida permissão para baixar temporariamente uma cópia dos materiais (informações ou software) no site DateWithMe, apenas para visualização transitória pessoal e não comercial. Esta é a concessão de uma licença, não uma transferência de título e, sob esta licença, você não pode:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Modificar ou copiar os materiais;</li>
                                <li>Usar os materiais para qualquer finalidade comercial ou para exibição pública;</li>
                                <li>Tentar descompilar ou fazer engenharia reversa de qualquer software contido no site;</li>
                                <li>Remover quaisquer direitos autorais ou outras notações de propriedade;</li>
                                <li>Transferir os materiais para outra pessoa ou 'espelhar' os materiais em qualquer outro servidor.</li>
                            </ul>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-bold text-gray-800">3. Isenção de Responsabilidade</h2>
                            <p>
                                Os materiais no site da DateWithMe são fornecidos 'como estão'. O DateWithMe não oferece garantias, expressas ou implícitas, e, por este meio, isenta e nega todas as outras garantias, incluindo, sem limitação, garantias implícitas ou condições de comercialização ou adequação a um fim específico.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-bold text-gray-800">4. Limitações</h2>
                            <p>
                                Em nenhum caso o DateWithMe ou seus fornecedores serão responsáveis por quaisquer danos (incluindo perda de dados ou lucro) decorrentes do uso ou da incapacidade de usar os materiais no site, mesmo que notificados da possibilidade de tais danos.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-bold text-gray-800">5. Compromisso do Usuário</h2>
                            <p>O usuário se compromete a fazer uso adequado dos conteúdos e da informação que o DateWithMe oferece e com caráter enunciativo, mas não limitativo:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>A) Não se envolver em atividades ilegais ou contrárias à boa fé;</li>
                                <li>B) Não difundir propaganda ou conteúdo de natureza racista, xenofóbica, ou pornografia ilegal;</li>
                                <li>C) Não causar danos aos sistemas físicos (hardware) e lógicos (software) do DateWithMe para introduzir vírus informáticos.</li>
                            </ul>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-bold text-gray-800">6. Precisão dos Materiais</h2>
                            <p>
                                Os materiais exibidos no site podem incluir erros técnicos, tipográficos ou fotográficos. O DateWithMe não garante que qualquer material em seu site seja preciso, completo ou atual.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-bold text-gray-800">7. Links</h2>
                            <p>
                                O DateWithMe não analisou todos os sites vinculados e não é responsável pelo conteúdo de nenhum site vinculado. A inclusão de qualquer link não implica endosso por DateWithMe.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-bold text-gray-800">8. Modificações</h2>
                            <p>
                                O DateWithMe pode revisar estes termos de serviço a qualquer momento, sem aviso prévio. Ao usar este site, você concorda em ficar vinculado à versão atual desses termos de serviço.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-bold text-gray-800">9. Lei Aplicável</h2>
                            <p>
                                Estes termos e condições são regidos e interpretados de acordo com as leis locais e você se submete irrevogavelmente à jurisdição exclusiva dos tribunais competentes.
                            </p>
                        </section>

                        <section className="space-y-3 border-t pt-6">
                            <h2 className="text-xl font-bold text-gray-800">Dúvidas?</h2>
                            <p>
                                Podes falar connosco através do email: <strong className="text-pink-600">datewitme6@gmail.com</strong>
                            </p>
                        </section>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
