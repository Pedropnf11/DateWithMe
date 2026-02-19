import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { Loader2, Heart, Calendar, Clock, MapPin, Star, MessageSquare } from 'lucide-react';

export default function Result() {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const key = searchParams.get('key');

    const [invite, setInvite] = useState(null);
    const [responses, setResponses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            // Verify access
            const { data: inviteData, error: inviteError } = await supabase
                .from('invites')
                .select('*')
                .eq('id', id)
                .single();

            if (inviteError || !inviteData) {
                setError('Invite não encontrado.');
                setLoading(false);
                return;
            }

            if (inviteData.creator_key !== key) {
                setError('Acesso negado. Precisas da chave de criador correta.');
                setLoading(false);
                return;
            }

            setInvite(inviteData);

            // Fetch responses
            const { data: respData, error: respError } = await supabase
                .from('responses')
                .select('*')
                .eq('invite_id', id)
                .order('created_at', { ascending: false });

            if (!respError) {
                setResponses(respData);
            }
            setLoading(false);
        }
        fetchData();
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
                        const dateAns = ans['step_date'] || {};

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
                                            {/* Date Info */}
                                            {dateAns.date && (
                                                <div className="bg-pink-50 p-6 rounded-2xl flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-pink-500">
                                                            <Calendar size={24} />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-black text-gray-800 uppercase tracking-wider">{new Date(dateAns.date + 'T00:00:00').toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
                                                            <p className="text-[10px] font-black text-pink-400 uppercase">{dateAns.startTime} - {dateAns.endTime}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-[10px] font-black text-pink-500 uppercase px-3 py-1 bg-white rounded-full border border-pink-100 italic">{dateAns.badge || 'DATE SCENARIO'}</span>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Other Steps Summary */}
                                            <div className="grid grid-cols-1 gap-3">
                                                {Object.entries(ans).map(([key, val]) => {
                                                    if (key === 'step_date') return null;
                                                    const step = invite?.content?.steps?.find(s => s.id === key);
                                                    if (!step) return null;

                                                    return (
                                                        <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                                            <div className="flex items-center gap-3 text-left">
                                                                <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{step.title}</span>
                                                            </div>
                                                            <span className="text-sm font-black text-gray-800 text-right">{typeof val === 'string' ? val : (val.label || JSON.stringify(val))}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
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
