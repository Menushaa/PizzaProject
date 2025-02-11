
import { TableContainer, Table, Thead, Tr, Th, Tbody, Td, Box, Flex, Heading, Button, HStack, Avatar, Text, Badge, useDisclosure, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, PopoverFooter, useToast } from '@chakra-ui/react'
import './App.css'
import { AddIcon, DeleteIcon, EditIcon, ViewIcon } from '@chakra-ui/icons'
import axios from 'axios'
import { BASE_URL } from './constant'
import { useEffect, useState } from 'react'
import { Item } from './types/item'
import ProductSkeleton from './components/ProductSkeleton'
import ItemForm from './components/ItemForm'
import ViewDetail from './components/ViewDetail'

function App() {

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen:viewDialogOpen, onOpen:onviewDialogOpen, onClose:viewDialogClose } = useDisclosure();
  const [currentData, setCurrentData] = useState<Item>({} as Item)

  const [data, setData] = useState<Item[]>([]);
  const [isloading, setIsLoading] = useState<boolean>(false);
  const toast = useToast();

  useEffect(() => {
    fetchdata();
  }, []);

  const fetchdata = () => {
    setIsLoading(true);
    axios.get(BASE_URL+"Item/GetAll").then((response) => {
      setData(response.data);
    }).catch((error) => {
      console.log(error);
    }).finally(() => {
      setIsLoading(false);
    })
  }

  const getItem = (id: number) => {
    axios.get<Item>(BASE_URL +`Item/GetById/${id}`+ id)
      .then((res) => {
        console.log(res);
        setCurrentData(res.data);
        onOpen();

      }).catch((err) => {
        console.log(err);
      })
  }

  const handleAdd = () => {
    onOpen();
    setCurrentData({} as Item);
  }

  const onDeleteHandel = (id: number) => {
    axios.delete(BASE_URL +`Item/Delete/`+ id).then(() => {
      toast({
        title: 'Item Deleted',
        description: 'Item Deleted Successfully',
        isClosable: true,
        duration: 1000
      })
      fetchdata();
    }).catch((err) => {
      console.log(err);
    })
  }

  const handleViewDetail = (id: number) => {
    axios.get<Item>(BASE_URL + `Item/GetById/`+ id)
      .then((res) => {
        setCurrentData(res.data);
        onviewDialogOpen();

      }).catch((err) => {
        console.log(err);
      })
  }

  if (isloading) {
    return <ProductSkeleton />
  }

  return (
    <Box
      shadow={'md'}
      rounded={'md'}
      m={32}
    >
      <Flex px='5'
        justifyContent={'space-between'}
        alignItems={'center'}
        mb={5}
      >
        <Heading fontSize='20'>
          Product List
        </Heading>
        <Button colorScheme='blue'
          leftIcon={<AddIcon />}
          onClick={() => handleAdd()}
        >
          Add Product
        </Button>

      </Flex>
      <TableContainer>
        <Table variant='striped'>
          <Thead>
            <Tr>
              <Th>Id</Th>
              <Th>Name</Th>
              <Th>Description</Th>
              <Th>Is In Store?</Th>
              <Th isNumeric>Price</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((item: Item) => (
              <Tr key={item.id}>
                <Td>{item.id}</Td>
                <Td>
                  <HStack>
                    <Avatar size='sm' name={item.name} />
                    <Text>{item.name}</Text>
                  </HStack>
                </Td>
                <Td>{item.description}</Td>
                <Td>
                  <Badge>{item.isInStore ? 'Yes' : 'No'}</Badge>
                </Td>
                <Td isNumeric>{item.price}</Td>
                <Td>
                  <HStack gap={3}>
                    <EditIcon
                      onClick={() => getItem(item.id)}
                      boxSize={22} color={'blue'} />
                    <Popover>
                      <PopoverTrigger>
                        <DeleteIcon boxSize={22} color={'red'} />
                      </PopoverTrigger>
                      <PopoverContent>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverHeader>Confirmation!</PopoverHeader>
                        <PopoverBody>Are you sure to delete this? </PopoverBody>
                        <PopoverFooter>
                          <Button
                            colorScheme='red'
                            onClick={() => onDeleteHandel(item.id)}
                            float={'right'}
                          >Delete</Button>
                        </PopoverFooter>
                      </PopoverContent>
                    </Popover>
                    <ViewIcon
                    onClick={() => handleViewDetail(item.id)} 
                    boxSize={22} 
                    color={'green'} />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      {
        data.length === 0 && <Heading textAlign={'center'} p='5' fontSize={14}>
          No Data
        </Heading>
      }
      {isOpen && (<ItemForm
        currentData={currentData}
        isOpen={isOpen}
        fetchItem={fetchdata}
        onClose={onClose} />)}

      {viewDialogOpen && <ViewDetail
        isOpen={viewDialogOpen}
        onClose={viewDialogClose}
        currentData={currentData}
      />}
    </Box>

  )
}

export default App
