import { Button, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, Text, DrawerFooter, HStack, Avatar, Heading, VStack } from "@chakra-ui/react"
import { Item } from "../types/item";

type ViewDetailProps = {
    isOpen: boolean;
    onClose: () => void;
    currentData: Item;
}

const ViewDetail = ({
    isOpen,
    onClose,
    currentData
}: ViewDetailProps) => {


    return (
        <>

            <Drawer
                isOpen={isOpen}
                placement='right'
                onClose={onClose}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>
                        View Detail {currentData.name}
                    </DrawerHeader>

                    <DrawerBody>
                        <HStack>
                            <Avatar
                                name={currentData.name}
                                size={'lg'}
                            />
                            <VStack alignItems={'self-start'}>
                                <Heading fontSize={16}>
                                    {currentData.name}
                                </Heading>
                                <Heading fontSize={20}>LKR{currentData.price}</Heading>
                                <Text>{currentData.description}</Text>
                            </VStack>
                        </HStack>
                    </DrawerBody>

                    <DrawerFooter>
                        <Button variant='outline' mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default ViewDetail
