import { useState, useEffect } from 'react';
import api from '../utils/api';

const TaxDeclaration = () => {
    const [declaration, setDeclaration] = useState({
        financialYear: '2024-2025',
        section80C: [{ description: '', amount: 0 }],
        section80D: { amount: 0 },
        hra: { rentAmount: 0, landlordPan: '' }
    });
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchDeclaration();
    }, []);

    const fetchDeclaration = async () => {
        try {
            const { data } = await api.get('/tax/declaration', { params: { financialYear: '2024-2025' } });
            if (data && data._id) {
                setDeclaration(data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handle80CChange = (index, field, value) => {
        const new80C = [...declaration.section80C];
        new80C[index][field] = value;
        setDeclaration({ ...declaration, section80C: new80C });
    };

    const add80C = () => {
        setDeclaration({ ...declaration, section80C: [...declaration.section80C, { description: '', amount: 0 }] });
    };

    const remove80C = (index) => {
        const new80C = declaration.section80C.filter((_, i) => i !== index);
        setDeclaration({ ...declaration, section80C: new80C });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/tax/declaration', declaration);
            setMessage('Declaration Saved Successfully');
        } catch (error) {
            setMessage('Error saving declaration');
        }
    };

    return (
        <div className="container px-4 py-6 mx-auto">
            <h1 className="mb-6 text-2xl font-bold text-gray-800">Tax Declaration ({declaration.financialYear})</h1>

            {message && <div className="p-4 mb-4 bg-blue-100 text-blue-800 rounded">{message}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Section 80C */}
                <div className="bg-white p-6 rounded shadow">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">Section 80C Investments (Max 1.5L)</h2>
                    {declaration.section80C.map((item, index) => (
                        <div key={index} className="flex gap-4 mb-4 items-end">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <input
                                    type="text"
                                    value={item.description}
                                    onChange={(e) => handle80CChange(index, 'description', e.target.value)}
                                    className="w-full border p-2 rounded mt-1"
                                    placeholder="LIC, PPF, etc."
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700">Amount</label>
                                <input
                                    type="number"
                                    value={item.amount}
                                    onChange={(e) => handle80CChange(index, 'amount', parseFloat(e.target.value))}
                                    className="w-full border p-2 rounded mt-1"
                                />
                            </div>
                            <button type="button" onClick={() => remove80C(index)} className="text-red-500 hover:text-red-700 font-bold px-2 py-2">X</button>
                        </div>
                    ))}
                    <button type="button" onClick={add80C} className="text-indigo-600 hover:text-indigo-800 font-medium">+ Add Investment</button>
                </div>

                {/* HRA */}
                <div className="bg-white p-6 rounded shadow">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">House Rent Allowance (HRA)</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Annual Rent Paid</label>
                            <input
                                type="number"
                                value={declaration.hra.rentAmount}
                                onChange={(e) => setDeclaration({ ...declaration, hra: { ...declaration.hra, rentAmount: parseFloat(e.target.value) } })}
                                className="w-full border p-2 rounded mt-1"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Landlord PAN</label>
                            <input
                                type="text"
                                value={declaration.hra.landlordPan}
                                onChange={(e) => setDeclaration({ ...declaration, hra: { ...declaration.hra, landlordPan: e.target.value } })}
                                className="w-full border p-2 rounded mt-1"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700">
                        Save Declaration
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TaxDeclaration;
