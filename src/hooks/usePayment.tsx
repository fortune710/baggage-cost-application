import { collection, getDocs, query, updateDoc, where } from "firebase/firestore";
import { useState, useEffect } from "react";
import { firestore } from "../environments/firebase";

interface Payment {
    id: string;
    amount: number;
    date: {
        nanoseconds: number;
        seconds: number;
    };
    issued_by: {
        id: string;
        name: string;
    };
    payment_id: string;
    tickets: {
        id: string;
        class: string;
        allowedWeight: number
    }[];
}

export const usePayment = (id:string) => {
    const [transaction, setTransaction] = useState<Payment[]>([]);
    const [isLoading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(true);

    const ref = collection(firestore, 'transactions');
    const queryRef = query(ref, where('payment_id', '==', id))
    
    const getTransaction = async () => {
        setLoading(true);
        setError(false);
        try {
            let transactions = [] as any[];
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
        getTransaction();
    }, [id]);
    
    return { transaction, isLoading, error };
}