import { useEffect, useState } from "react";
import {
  ApplicationResponse,
  applicationService,
} from "../../services/ApplicationService.ts";
import { useParams } from "react-router-dom";
import { Headline } from "../Headline.tsx";

export const Applications = () => {
  const { id } = useParams();
  const [applications, setApplications] = useState<ApplicationResponse[]>([]);

  useEffect(() => {
    if (id) {
      fetchApplications(id);
    }
  }, [id]);

  const fetchApplications = async (postId: string) => {
    try {
      const data = await applicationService.getApplicationsForPost(postId);
      setApplications(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="m-5">
      <Headline title="Applications" textColor="text-steel-blue" />
      <table className="table-auto border-collapse border border-gray-300 w-full text-left">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">First Name</th>
            <th className="border border-gray-300 px-4 py-2">Last Name</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">Phone Number</th>
            <th className="border border-gray-300 px-4 py-2">Instrument</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((application) => (
            <tr key={application.applicant_id.email}>
              <td className="border border-gray-300 px-4 py-2">
                {application.applicant_id.first_name}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {application.applicant_id.last_name}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {application.applicant_id.email}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {application.applicant_id.phone_number}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {application.applicant_id.instrument}
              </td>
              <td className="border border-gray-300 px-4 py-2 flex gap-2">
                <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                  Accept
                </button>
                <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
