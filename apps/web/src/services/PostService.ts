// import { getRequest, postRequest } from "../utils/api";
// import { Instrument } from "../enums/Instrument";
//
// export interface Ensemble {
//   _id: string;
//   name: string;
//   description: string;
//   location: {
//     city: string;
//     country: string;
//     address: string;
//   };
//   open_positions: Instrument[];
//   is_active: boolean;
// }
//
// export interface CreatePostInput extends Record<string, any> {
//   name: string;
//   description: string;
//   location: {
//     city: string;
//     country: string;
//     address: string;
//   };
//   openPositions: Instrument[];
//   isActive: boolean;
// }
//
// export const postService = {
//   createPost: async (data: CreateEnsembleInput): Promise<Ensemble> => {
//     const response = await postRequest("/ensemble", data);
//     return response as Ensemble;
//   },
// };
