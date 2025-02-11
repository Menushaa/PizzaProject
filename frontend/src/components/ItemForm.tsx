import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, VStack, Textarea, Text, Input, Switch, useToast } from "@chakra-ui/react"
import axios from "axios";
import { useState } from "react";
import { BASE_URL } from "../constant";
import { Item } from "../types/item";

type ItemFormProps = {
    isOpen: boolean;
    onClose: () => void;
    fetchItem: () => void;
    currentData?: Item
}

const ItemForm = ({ isOpen, onClose, fetchItem, currentData }: ItemFormProps) => {
    const toast = useToast();
    const [Item, setItem] = useState({
        id: currentData?.id || 0,
        name: currentData?.name || '',
        description: currentData?.description || '',
        price: currentData?.price || 0,
        isInStore: currentData?.isInStore || false,
    })

    const onSave = () => {
        if (currentData?.id) {
            editItem();
        } else {
            addItem();
        }
    }

    const editItem = () => {
        axios.put(BASE_URL + `Item/Update/` + currentData?.id, Item, {
            headers: { "Content-Type": "application/json" }
        }).then(() => {
            onClose();
            fetchItem();

            toast({
                title: 'Item Updated',
                description: 'Item Updated Successfully',
                isClosable: true,
                duration: 1000
            })

        }).catch((err) => {
            console.log(err);
        })
    }

    const addItem = () => {
        axios.post(BASE_URL + `Item/Create`, Item).then(() => {
            onClose();
            fetchItem();

            toast({
                title: 'Item Added',
                description: 'Item Added Successfully',
                isClosable: true,
                duration: 1000
            })

        }).catch((err) => {
            console.log(err);
        })
    }

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader shadow={'sm'}>
                        Add Item
                        {/* {currentData ? "Edit Item" : "Add Item"} */}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack gap={4} alignItems={'self-start'}>
                            <Input
                                type="text"
                                placeholder="Name"
                                value={Item.name}
                                onChange={(e) => setItem({ ...Item, name: e.target.value })} />
                            <Textarea placeholder="Discription"
                                value={Item.description}
                                onChange={(e) => setItem({ ...Item, description: e.target.value })} />
                            <Input
                                type="number"
                                value={Item.price}
                                onChange={(e) => setItem({ ...Item, price: parseInt(e.target.value) })} />
                            <Text>Is In Store?</Text>
                            <Switch
                                isChecked={Item.isInStore}
                                onChange={(e) => setItem({ ...Item, isInStore: e.target.checked })}
                            />
                        </VStack>
                    </ModalBody>

                    <ModalFooter>
                        <Button variant='ghost' mr={3} onClick={onClose}>
                            Close
                        </Button>
                        <Button
                            onClick={onSave}
                            colorScheme='blue'>
                            Save
                            {/* {currentData ? "Update" : "Save"} */}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ItemForm
