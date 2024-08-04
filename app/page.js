'use client'

import { useState, useEffect } from 'react'
import { Box, Stack, Typography, Button, Modal, TextField } from '@mui/material'
import { firestore } from '@/firebase'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  borderRadius: 8,
  //border: '2px solid #000',
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
}

const buttonStyle = {
  backgroundColor: '#6200ea',
  color: 'white',
  '&:hover': {
    backgroundColor: '#3700b3',
  },
}

const itemCardStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  bgcolor: '#f0f0f0',
  padding: 2,
  borderRadius: 4,
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
}

const itemNameStyle = {
  fontSize: '1.25rem',
  fontWeight: 500,
  color: '#333',
}



export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() })
    })
    setInventory(inventoryList)
  }
  
  useEffect(() => {
    updateInventory()
  }, [])

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }
    await updateInventory()
  }
  
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }
    await updateInventory()
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )



  return (           
    <Box
      width="100vw"
      height="100vh"
      bgcolor="#fafafa"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
      padding={4}
    >
      <Modal open={open} onClose={handleClose}>
        <Box 
          sx = {style}
          > 
            <Typography variant="h6"> Add Item</Typography>
            <Stack width="100%" direction="row" spacing={2}>
              <TextField 
                variant="outlined"
                fullWidth
                value={itemName}
                onChange={(e) => setItemName(e.target.value)} 
              />
              <Button 
                variant='outlined'
                sx ={buttonStyle}
                onClick={()=> {
                  addItem(itemName) 
                  setItemName('') 
                  handleClose()
                }}
              > 
                Add 
              </Button>
            </Stack>
          </Box>
      </Modal>
      <Button 
        variant='contained'
        sx = {buttonStyle}
        onClick={() => {
          handleOpen()
        }}
      >
        Add New Item
      </Button>
      <TextField
        variant="outlined"
        placeholder="Search items"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ maxWidth: '800px', marginBottom: 2 }}
      />
      <Box width="800px">
        <Box 
          width="100%"
          height="100px"
          bgcolor="#ADD8E6"
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="8px"
          boxShadow="0px 2px 4px rgba(0, 0, 0, 0.1)"
          mb={2}>
            <Typography variant="h2" color="#333">
              Pantry Items
            </Typography>
          </Box>
      </Box>
      <Stack width ="800px" height="300px" spacing={2} overflow="auto" >
        {filteredInventory.map(({name, quantity}) => (
            <Box 
              key={name} 
              sx={itemCardStyle}
            >
              <Typography sx={itemCardStyle}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography sx={itemCardStyle}>
                {quantity}
              </Typography>
              <Button variant='contained' color='error' onClick={()=> {removeItem(name)}}>X</Button>

            </Box>
          ))}
      </Stack>
    </Box>
  )
}
