import { useQuery } from "@tanstack/react-query";
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
    
    const getStaff = async () => {
        let users = [] as Staff[];
        const ref = collection(firestore, 'users');
        const snapshot = await getDocs(ref);

        if(snapshot.empty) {
            return users;
        }

        snapshot.forEach((doc) => {
            users = [...users, doc.data() as Staff]
        });
        
        return users;
    };

    const { isLoading, data: staff } = useQuery(["all-staff"], getStaff, {
        refetchOnWindowFocus: false
    })
    
    return { staff, isLoading };
}