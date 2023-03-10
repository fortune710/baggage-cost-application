import { collection, getDocs, query, where } from "firebase/firestore";
import { useState, useEffect } from "react";
import { firestore } from "../environments/firebase";

interface Transaction {
    id: string;
    amount: number;
    date: string;
    issued_by: {
        id: string;
        name: string;
    };
    payment_id: string;
}

export const useStaff = (id:string) => {
    const [transaction, setTransaction] = useState<Transaction[]>([]);
    const [isLoading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(true);
    
    const getTransactions = async () => {
        setLoading(true);
        setError(false);
        try {
            let transactions = [] as any[];
            const ref = collection(firestore, 'transactions');
            const queryRef = query(ref, where('issued_by.id', '==', id))
            const snapshot = await getDocs(queryRef);

            if(snapshot.empty){
                setLoading(false);
                setTransaction([])
                return;
            } else {
                snapshot.forEach((doc) => {
                    transactions = [...transactions, { id: doc.id, ...doc.data() }]
                });
    
                setTransaction(transactions);
                setLoading(false)
            }
            
        } catch (error) {
            setLoading(false)
            setError(true)
        }
    };
    
    useEffect(() => {
        getTransactions();
    }, []);
    
    return { transaction, isLoading, error };
}