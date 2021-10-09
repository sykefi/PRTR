import { WasteTransfer } from '../../api/models/WasteTransfer'

export const WasteTransferTable = ({
  loading,
  wasteTransfers
}: {
  loading: boolean
  wasteTransfers: WasteTransfer[]
}) => {
  return <div> Todo: table for {wasteTransfers.length} waste transfer.</div>
}
