import { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import AuthContext from '../context/AuthContext';

const ComplianceConfig = () => {
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [config, setConfig] = useState({
        pf: { enabled: true, employerContribution: 12, employeeContribution: 12 },
        esi: { enabled: true, employerContribution: 3.25, employeeContribution: 0.75 },
        professionalTax: { enabled: false, slabs: [] }
    });
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const { data } = await api.get('/statutory');
            if (data && data._id) {
                setConfig(data);
            }
        } catch (error) {
            console.error('Error fetching config', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (section, field, value) => {
        setConfig(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put('/statutory', config);
            setMessage('Configuration updated successfully');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Failed to update configuration');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="container px-4 py-6 mx-auto animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Compliance Configuration</h1>
                    <p className="text-gray-500">Manage statutory deductions and rules</p>
                </div>
            </div>

            {message && (
                <div className={`p-4 mb-6 rounded-lg border-l-4 flex items-center gap-3 ${message.includes('success') ? 'bg-green-50 border-green-500 text-green-700' : 'bg-red-50 border-red-500 text-red-700'}`}>
                    <span>{message}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* PF Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-800">Provident Fund (PF)</h2>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={config.pf.enabled} onChange={(e) => handleChange('pf', 'enabled', e.target.checked)} className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                <span className="ml-3 text-sm font-medium text-gray-900">{config.pf.enabled ? 'Enabled' : 'Disabled'}</span>
                            </label>
                        </div>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Employer Contribution (%)</label>
                            <input
                                type="number"
                                value={config.pf.employerContribution}
                                onChange={(e) => handleChange('pf', 'employerContribution', parseFloat(e.target.value))}
                                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50 border"
                                disabled={!config.pf.enabled}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Employee Contribution (%)</label>
                            <input
                                type="number"
                                value={config.pf.employeeContribution}
                                onChange={(e) => handleChange('pf', 'employeeContribution', parseFloat(e.target.value))}
                                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50 border"
                                disabled={!config.pf.enabled}
                            />
                        </div>
                    </div>
                </div>

                {/* ESI Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-800">Employee State Insurance (ESI)</h2>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={config.esi.enabled} onChange={(e) => handleChange('esi', 'enabled', e.target.checked)} className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                <span className="ml-3 text-sm font-medium text-gray-900">{config.esi.enabled ? 'Enabled' : 'Disabled'}</span>
                            </label>
                        </div>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Employer Contribution (%)</label>
                            <input
                                type="number"
                                value={config.esi.employerContribution}
                                onChange={(e) => handleChange('esi', 'employerContribution', parseFloat(e.target.value))}
                                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50 border"
                                disabled={!config.esi.enabled}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Employee Contribution (%)</label>
                            <input
                                type="number"
                                value={config.esi.employeeContribution}
                                onChange={(e) => handleChange('esi', 'employeeContribution', parseFloat(e.target.value))}
                                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50 border"
                                disabled={!config.esi.enabled}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-colors shadow-lg shadow-blue-500/30"
                    >
                        Save Configuration
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ComplianceConfig;
