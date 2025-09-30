// backend/src/routes/certificates.js
import express from "express";
import { getAllCertificates, mintCertificates } from "../controllers/certificateController.js";
import { validateMintCertificates } from "../utils/validator.js";

const router = express.Router();
router.get("/", getAllCertificates);
router.post("/mint", validateMintCertificates, mintCertificates);

export default router;
