import {createContext} from 'react';

export const AddItemModalContext = createContext<AddItemModalContextType>({
    isModalActive: false,
    setIsModalActive: (isModalActive: boolean) => {},
    addItemName: '',
    setAddItemName: (name: string) => {},
    addItemQuantity: 0,
    setAddItemQuantity: (quantity: number) => {},
    addItemUnit: '',
    setAddItemUnit: (unit: string) => {},
    addItemSpace: null,
    setAddItemSpace: (space: string | null) => {},
});

export interface AddItemModalContextType {
    isModalActive: boolean;
    setIsModalActive: (isModalActive: boolean) => void;
    addItemName: string;
    setAddItemName: (name: string) => void;
    addItemQuantity: number;
    setAddItemQuantity: (quantity: number) => void;
    addItemUnit: string;
    setAddItemUnit: (unit: string) => void;
    addItemSpace: string | null;
    setAddItemSpace: (space: string | null) => void;
}
