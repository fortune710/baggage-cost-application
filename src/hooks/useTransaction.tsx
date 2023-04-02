import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { firestore } from "../environments/firebase";
import { Transaction as BaseTransaction } from "../types";
interface Transaction extends BaseTransaction {
    tickets?: {
        allowedWeights: number,
        class: string;
        id: string;
    }[],
    airports?: {
        departure: string;
        arrival: string;
    }
}

export const useTransaction = () => {
    
    const getTransactions = async () => {
        let transactions = [] as Transaction[];
        const ref = collection(firestore, 'transactions');
        const firestoreQuery = query(ref, orderBy('date', 'desc'))
        const snapshot = await getDocs(firestoreQuery);
        
        if(snapshot.empty){
            return transactions!;
        } 
        
        snapshot.forEach((doc) => {
            transactions = [...transactions, { id: doc.id, ...doc.data() as any }]
        });

        return transactions!;
    };

    const { isLoading, data: transaction, error } = useQuery(["all-transactions"], getTransactions)
    
    return { transaction, isLoading, error };
}