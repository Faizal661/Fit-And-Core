import { useState, FormEvent } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../config/axios.config";

// Define the User interface
interface User {
  _id: string;
  username: string;
  profilePicture?: string;
  email: string;
  isBlocked: boolean;
  createdAt: string;
}

// Define the API response type
interface UsersResponse {
  users: User[];
  total: number;
}

// Fetch users function with typed parameters
const fetchUsers = async ({
  page,
  limit,
  search,
}: {
  page: number;
  limit: number;
  search: string;
}): Promise<UsersResponse> => {
  const response = await axios.get<UsersResponse>("/user/users", {
    params: { page, limit, search },
  });
  return response.data;
};

// Toggle block status function with typed parameters
const toggleBlockStatus = async ({
  userId,
  isBlocked,
}: {
  userId: string;
  isBlocked: boolean;
}): Promise<User> => {
  const response = await axios.patch<User>(`/user/${userId}/block`, {
    isBlocked: !isBlocked,
  });
  return response.data;
};

const UserManagement = () => {
  const [activePage, setActivePage] = useState<number>(1);
  const [recordsPerPage, setRecordsPerPage] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<UsersResponse, Error>({
    queryKey: ["users", activePage, recordsPerPage, searchTerm],
    queryFn: () =>
      fetchUsers({ page: activePage, limit: recordsPerPage, search: searchTerm }),
    staleTime: 5000, // Optional: keeps data fresh for 5 seconds
  });

  const mutation = useMutation<User, Error, { userId: string; isBlocked: boolean }>({
    mutationFn: toggleBlockStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users", activePage, recordsPerPage, searchTerm],
      });
    },
  });

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setActivePage(1); // Reset to first page on search
  };

  const handleBlockToggle = (userId: string, isBlocked: boolean) => {
    mutation.mutate({ userId, isBlocked });
  };

  const openDetailsModal = (user: User) => setSelectedUser(user);
  const closeModal = () => setSelectedUser(null);

  const totalPages = data ? Math.ceil(data.total / recordsPerPage) : 1;

  return (
    <div className="min-h-screen bg-gray-400">
      <h1 className="text-2xl font-bold text-gray-800 pl-20 px-6 py-4">
        User Management
      </h1>
      <div className="border-b-1 pt-2 mb-5"></div>

      {/* Search and Records Per Page */}
      <div className="flex justify-between items-center mb-6 m-6">
        <form onSubmit={handleSearch} className="flex items-center">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by username or email..."
            className="px-4 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
          >
            Search
          </button>
        </form>
        <div className="flex items-center">
          <label className="mr-2 text-gray-700">Records per page:</label>
          <select
            value={recordsPerPage}
            onChange={(e) => {
              setRecordsPerPage(Number(e.target.value));
              setActivePage(1);
            }}
            className="px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white shadow p-6 mb-6 m-6">
        {isLoading ? (
          <div className="text-center text-lg text-gray-500 py-8">Loading...</div>
        ) : error ? (
          <div className="text-center text-lg text-red-500 py-8">
            Error: {error.message}
          </div>
        ) : !data || data.users.length === 0 ? (
          <div className="text-center text-lg text-gray-500 py-8">
            No users found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">ID</th>
                  <th className="py-3 px-6 text-left">Username</th>
                  <th className="py-3 px-6 text-left">Profile Picture</th>
                  <th className="py-3 px-6 text-left">Email</th>
                  <th className="py-3 px-6 text-center">Status</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm">
                {data.users.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="py-3 px-6 text-left">{user._id}</td>
                    <td className="py-3 px-6 text-left whitespace-nowrap font-medium">
                      {user.username}
                    </td>
                    <td className="py-3 px-6 text-left">
                      <img
                        src={user.profilePicture || "/default-avatar.png"}
                        alt={user.username}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    </td>
                    <td className="py-3 px-6 text-left">{user.email}</td>
                    <td className="py-3 px-6 text-center">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          user.isBlocked
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {user.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex item-center justify-center">
                        <button
                          onClick={() => handleBlockToggle(user._id, user.isBlocked)}
                          className={`mx-1 ${
                            user.isBlocked
                              ? "text-green-600 hover:text-green-900"
                              : "text-red-600 hover:text-red-900"
                          }`}
                          disabled={mutation.isPending}
                        >
                          {mutation.isPending
                            ? "Updating..."
                            : user.isBlocked
                            ? "Unblock"
                            : "Block"}
                        </button>
                        <button
                          onClick={() => openDetailsModal(user)}
                          className="text-blue-600 hover:text-blue-900 mx-1"
                        >
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {data && data.total > recordsPerPage && (
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => setActivePage((prev) => Math.max(prev - 1, 1))}
              disabled={activePage === 1}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400 hover:bg-blue-700"
            >
              Previous
            </button>
            <span>
              Page {activePage} of {totalPages}
            </span>
            <button
              onClick={() => setActivePage((prev) => Math.min(prev + 1, totalPages))}
              disabled={activePage === totalPages}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400 hover:bg-blue-700"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-3xl overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 bg-blue-600 text-white">
              <h2 className="text-xl font-semibold">User Details</h2>
              <button
                onClick={closeModal}
                className="text-white hover:text-gray-200"
              >
                ✕
              </button>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Personal Information
                  </h3>
                  <div className="mb-3">
                    <span className="text-gray-600 font-medium">ID:</span>
                    <span className="ml-2">{selectedUser._id}</span>
                  </div>
                  <div className="mb-3">
                    <span className="text-gray-600 font-medium">Username:</span>
                    <span className="ml-2">{selectedUser.username}</span>
                  </div>
                  <div className="mb-3">
                    <span className="text-gray-600 font-medium">Email:</span>
                    <span className="ml-2">{selectedUser.email}</span>
                  </div>
                  <div className="mb-3">
                    <span className="text-gray-600 font-medium">Status:</span>
                    <span
                      className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                        selectedUser.isBlocked
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {selectedUser.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Additional Information
                  </h3>
                  <div className="mb-3">
                    <span className="text-gray-600 font-medium">Created At:</span>
                    <span className="ml-2">
                      {new Date(selectedUser.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeModal}
                  className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;