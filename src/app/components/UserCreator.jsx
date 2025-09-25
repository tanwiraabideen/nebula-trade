"use client"

import { useEffect } from 'react';
import { createUser } from '../actions/actions';

export default function UserCreator() {
    useEffect(() => {
        createUser();
    }, []);

    return null;
}