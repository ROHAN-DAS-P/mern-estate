import express from 'express';
import { createListing } from '../controllers/listing.controller.js';
import { verifyUser } from '../utils/verifyUser.js';    
import e from 'express';


const router = express.Router();

router.post('/create', verifyUser, createListing);

export default router;