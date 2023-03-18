import { useQuery } from "@tanstack/react-query";
import { collection, getDocs } from "firebase/firestore";
import { useState, useEffect } from "react";
import { firestore } from "../environments/firebase";

interface TicketClass {
    id: string;
    allowed_weight: number;
    cost_per_kg: number;
}

export const useAllowedWeights = () => {
    
    const getAllowedWeights = async () => {

        let weights = [] as TicketClass[];
        const ref = collection(firestore, 'allowed-weights');
        const snapshot = await getDocs(ref);

        if(snapshot.empty){
            return weights;
        }

        snapshot.forEach((doc) => {
            weights = [...weights, { id: doc.id, ...doc.data() as any }]
        });
        return weights;
    };

    const { isLoading, data: allowedWeights, error } = useQuery(["ticket-classes"], getAllowedWeights, {
        refetchInterval: false,
        refetchOnWindowFocus: false,
    })
        
    return { allowedWeights, isLoading, error };
}