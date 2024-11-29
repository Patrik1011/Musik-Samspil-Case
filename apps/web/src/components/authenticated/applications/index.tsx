import { useEffect, useState } from "react";
import { ApplicationResponse, applicationService } from "../../../services/ApplicationService.ts";
import { useParams } from "react-router-dom";
import { Headline } from "../../Headline.tsx";
import { ConfirmationModal } from "../../ConfirmationModal.tsx";
import { ApplicationStatus } from "../../../enums/ApplicationStatus.ts";

export const Applications = () => {
  const { id } = useParams();
  const [applications, setApplications] = useState<ApplicationResponse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApplicationId] = useState<string | null>(null);
  const [selectedStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState<Record<string, boolean>>({});

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

  const handleApplicationConfirm = async () => {
    if (!selectedApplicationId || !selectedStatus) return;
    try {
      await applicationService.changeApplicationStatus(
        selectedApplicationId,
        selectedStatus as ApplicationStatus,
      );
      setIsModalOpen(false);
      if (id) fetchApplications(id);
    } catch (error) {
      console.error("Failed to update application status:", error);
    }
  };

  const handleStatusChange = async (applicationId: string, status: ApplicationStatus) => {
    setLoading((prev) => ({ ...prev, [applicationId]: true }));
    try {
      await applicationService.changeApplicationStatus(applicationId, status);
      setApplications((prev) =>
        prev.map((app) => (app._id === applicationId ? { ...app, status } : app)),
      );
    } catch (error) {
      console.error("Failed to update application status:", error);
    } finally {
      setLoading((prev) => ({ ...prev, [applicationId]: false }));
    }
  };

  return (
    <div className="m-5">
      <Headline title="Applications" textColor="text-steel-blue" />
      <table className="table-auto border-collapse border border-gray-300 w-full text-left bg-white">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">First Name</th>
            <th className="border border-gray-300 px-4 py-2">Last Name</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">Phone Number</th>
            <th className="border border-gray-300 px-4 py-2">Instrument</th>
            <th className="border border-gray-300 px-4 py-2">Message</th>
            <th className="border border-gray-300 px-4 py-2">Status</th>
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
              <td className="border border-gray-300 px-4 py-2">
                {application.message || "No message"}
              </td>
              <td className="border border-gray-300 px-4 py-2">{application.status}</td>
              <td className="border border-gray-300 px-4 py-2">
                {application.status === ApplicationStatus.Pending && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleStatusChange(application._id, ApplicationStatus.Approved)
                      }
                      disabled={loading[application._id]}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                    >
                      Accept
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleStatusChange(application._id, ApplicationStatus.Rejected)
                      }
                      disabled={loading[application._id]}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
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
