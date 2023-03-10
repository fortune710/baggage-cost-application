import { collection, getDocs } from "firebase/firestore";
import { useState, useEffect } from "react";
import { firestore } from "../environments/firebase";

interface Staff {
    id: string;
    name: string;
    email: string;
    password: string;
    last_login?: string;
}

export const useStaff = () => {
    const [staff, setStaff] = useState<Staff[]>([]);
    const [isLoading, setLoading] = useState<boolean>(false);
    
    const getStaff = async () => {
        setLoading(true)
        try {
            let users = [] as any[];
            const ref = collection(firestore, 'users');
            const snapshot = await getDocs(ref);
            snapshot.forEach((doc) => {
                users = [...users, doc.data()]
            });
            setStaff(users)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.error(error)
        }
        //setStaff(data);
    };
    
    useEffect(() => {
        getStaff();
    }, []);
    
    return { staff, isLoading };
}