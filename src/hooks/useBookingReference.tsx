import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, query, updateDoc, where } from "firebase/firestore";
import { useState, useEffect } from "react";
import { firestore } from "../environments/firebase";

interface Payment {
    id: string;
    amount: number;
    date: string;
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
    booking_references: string[];
}

export const useBookingRefernce = (id:string) => {
    const ref = collection(firestore, 'transactions');
    const queryRef = query(ref, where('booking_references', 'array-contains', id));

    const getTransactions = async () => {
        let transactions = [] as any[];
        const snapshot = await getDocs(queryRef);
    
        if(snapshot.empty){
            return [] as Array<Payment>;
        } 
        
        snapshot.forEach((doc) => {
            transactions = [...transactions, { id: doc.id, ...doc.data() }]
        });

       return transactions as Array<Payment>;
    }

    const { isLoading, error, data: transaction } = useQuery(["booking-reference", id], getTransactions)

    
    return { transaction, isLoading, error };
}