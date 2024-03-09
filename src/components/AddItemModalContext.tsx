import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {RefObject, createContext, useContext, useEffect, useState} from 'react';
import isTabletDimensions from '../util/isTabletDimensions';

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
    modalRef: {} as RefObject<BottomSheetModal>,
    setModalRef: (modalRef: RefObject<BottomSheetModal>) => {},
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
    modalRef: RefObject<BottomSheetModal> | null;
    setModalRef: (modalRef: RefObject<BottomSheetModal>) => void;
}

const AddItemModalContextProvider = ({
    children,
}: {
    children: React.ReactNode;
}): JSX.Element => {
    const [isModalActive, setIsModalActive] = useState(false);
    const [addItemName, setAddItemName] = useState('');
    const [addItemQuantity, setAddItemQuantity] = useState(0);
    const [addItemUnit, setAddItemUnit] = useState('');
    const [addItemSpace, setAddItemSpace] = useState<string | null>(null);
    const [addItemTags, setAddItemTags] = useState<string[]>([]);
    const [modalRef, setModalRef] =
        useState<RefObject<BottomSheetModal> | null>(null);
    const isTablet = isTabletDimensions();

    useEffect(() => {
        // TODO: close modal
        if (!isTablet) {
            isModalActive
                ? modalRef?.current?.present()
                : modalRef?.current?.dismiss();
        }
    }, [isModalActive]);

    return (
        <AddItemModalContext.Provider
            value={{
                isModalActive,
                setIsModalActive,
                addItemName,
                setAddItemName,
                addItemQuantity,
                setAddItemQuantity,
                addItemUnit,
                setAddItemUnit,
                addItemSpace,
                setAddItemSpace,
                modalRef,
                setModalRef,
            }}>
            {children}
        </AddItemModalContext.Provider>
    );
};

const useAddItemModalContext = () => {
    return useContext(AddItemModalContext);
};

export {AddItemModalContextProvider, useAddItemModalContext};
