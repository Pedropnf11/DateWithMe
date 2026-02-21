import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

export default function Privacy() {
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
                            <Shield size={24} />
                        </div>
                        <h1 className="text-3xl font-black text-gray-800 uppercase tracking-tighter">Política de Privacidade</h1>
                    </div>

                    <div className="space-y-6 text-gray-600 leading-relaxed font-medium">
                        <p className="text-sm italic">Última atualização: 21 de Fevereiro de 2026</p>

                        <section className="space-y-3">
                            <p>
                                A sua privacidade é importante para nós. É política do <strong>DateWithMe</strong> respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar no site DateWithMe, e outros sites que possuímos e operamos.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-bold text-gray-800">1. Coleta de Informações</h2>
                            <p>
                                Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço. Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento. Também informamos por que estamos coletando e como será usado.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-bold text-gray-800">2. Retenção e Segurança</h2>
                            <p>
                                Apenas retemos as informações coletadas pelo tempo necessário para fornecer o serviço solicitado.
                                <strong> Por motivos de segurança, todos os convites e respostas são apagados automaticamente após 24 horas.</strong>
                            </p>
                            <p>
                                Quando armazenamos dados, protegemos dentro de meios comercialmente aceitáveis para evitar perdas e roubos, bem como acesso, divulgação, cópia, uso ou modificação não autorizados.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-bold text-gray-800">3. Compartilhamento de Dados</h2>
                            <p>
                                Não compartilhamos informações de identificação pessoal publicamente ou com terceiros, exceto quando exigido por lei.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-bold text-gray-800">4. Links Externos</h2>
                            <p>
                                O nosso site pode ter links para sites externos que não são operados por nós. Esteja ciente de que não temos controle sobre o conteúdo e práticas desses sites e não podemos aceitar responsabilidade por suas respetivas políticas de privacidade.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-bold text-gray-800">5. Cookies e Tecnologia</h2>
                            <p>
                                Não usamos cookies de publicidade. Usamos apenas o armazenamento local do teu navegador para guardar a tua chave de acesso, garantindo que sejas o único a visualizar os teus resultados.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-bold text-gray-800">6. Contacto</h2>
                            <p>
                                Se tiveres alguma dúvida sobre como tratamos os teus dados, entra em contacto connosco. <strong>Tens direito a aceder, corrigir ou solicitar a eliminação dos teus dados a qualquer momento, contactando-nos pelo email:</strong> <strong className="text-pink-600">datewitme6@gmail.com</strong>
                            </p>
                        </section>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
