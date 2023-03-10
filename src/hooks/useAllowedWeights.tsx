import { collection, getDocs } from "firebase/firestore";
import { useState, useEffect } from "react";
import { firestore } from "../environments/firebase";

interface TicketClass {
    id: string;
    allowed_weight: number;
    cost_per_kg: number;
}

export const useAllowedWeights = () => {
    const [allowedWeights, setAllowedWeights] = useState<TicketClass[]>([]);
    const [isLoading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(true);
    
    const getAllowedWeights = async () => {
        setLoading(true);
        setError(false);

        try {
            let weights = [] as any[];
            const ref = collection(firestore, 'allowed-weights');
            const snapshot = await getDocs(ref);

            if(snapshot.empty){
                setLoading(false);
                setAllowedWeights([])
                return;
            } else {
                snapshot.forEach((doc) => {
                    weights = [...weights, { id: doc.id, ...doc.data()}]
                });
                
                setAllowedWeights(weights);
                setLoading(false)
            }
            
        } catch (error) {
            setLoading(false)
            setError(true);
            console.error(error)
        }
    };
    
    useEffect(() => {
        getAllowedWeights();
    }, []);
    
    return { allowedWeights, isLoading, error };
}