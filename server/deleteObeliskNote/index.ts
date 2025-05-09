import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { authenticatedAzureWrap } from '../src/azureWrap'
import deleteRoomNote from '../src/endpoints/roomNote/deleteRoomNote'
import deleteObeliskNote from '../src/endpoints/obelisk/deleteObeliskNote'

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  await authenticatedAzureWrap(context, req, deleteObeliskNote, { audit: true })
}

export default httpTrigger
