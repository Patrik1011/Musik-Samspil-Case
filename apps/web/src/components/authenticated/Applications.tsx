import { useEffect, useState } from "react";
import { ApplicationResponse, applicationService } from "../../services/ApplicationService.ts";
import { useParams } from "react-router-dom";
import { Headline } from "../Headline.tsx";
import { ConfirmationModal } from "../ConfirmationModal.tsx";

export const Applications = () => {
  const { id } = useParams();
  const [applications, setApplications] = useState<ApplicationResponse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

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

  const openModal = (applicationId: string, status: string) => {
    setSelectedApplicationId(applicationId);
    setSelectedStatus(status);
    setIsModalOpen(true);
  };

  const handleApplicationConfirm = async () => {
    if (!selectedApplicationId || !selectedStatus) return;
    console.log(selectedApplicationId, selectedStatus);
    try {
      await applicationService.changeApplicationStatus(selectedApplicationId, selectedStatus);
      setIsModalOpen(false);
      if (id) fetchApplications(id);
    } catch (error) {
      console.error("Failed to update application status:", error);
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
            <tr key={application._id}>
              <td className="border border-gray-300 px-4 py-2">
                {application.applicant?.first_name || "N/A"}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {application.applicant?.last_name || "N/A"}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {application.applicant?.email || "N/A"}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {application.applicant?.phone_number || "N/A"}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {application.instrument || "N/A"}
              </td>
              <td className="border border-Pgray-300 px-4 py-2 flex gap-2">
                {application.status === "pending" ? (
                  <>
                    <button
                      type="button"
                      onClick={() => openModal(application._id, "approved")}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                      Accept
                    </button>
                    <button
                      type="button"
                      onClick={() => openModal(application._id, "rejected")}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <span
                    className={`px-4 py-2 rounded ${
                      application.status === "approved" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {application.status}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ConfirmationModal
        title="Application Confirmation"
        message={`Are you sure you want to ${selectedStatus} this application?`}
        isOpen={isModalOpen}
        onConfirm={handleApplicationConfirm}
        onCancel={() => setIsModalOpen(false)}
      />
    </div>
  );
};
