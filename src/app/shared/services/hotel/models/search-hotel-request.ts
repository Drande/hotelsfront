import { SearchRoomRequest } from "../../room/models/search-room-request";

export interface SearchHotelRequest extends SearchRoomRequest {
  globalSearch?: string;
}