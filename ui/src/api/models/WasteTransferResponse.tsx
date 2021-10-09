import { WasteTransfer } from './WasteTransfer'
import { PRTRListResponse } from './PRTRListResponse'

export type WasteTransferResponse = PRTRListResponse<Omit<WasteTransfer, 'id'>>
