import { useState, FormEvent } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  User,
  UsersResponse,
  fetchUsers,
  toggleBlockStatus,
} from "../../services/admin/userManagement";
import Footer from "../../components/shared/Footer";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
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
      fetchUsers({
        page: activePage,
        limit: recordsPerPage,
        search: searchTerm,
      }),
    staleTime: 5000,
  });

  const mutation = useMutation<
    User,
    Error,
    { userId: string; isBlocked: boolean }
  >({
    mutationFn: toggleBlockStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users", activePage, recordsPerPage, searchTerm],
      });
    },
  });

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setActivePage(1);
  };

  const handleBlockToggle = (userId: string, isBlocked: boolean) => {
    mutation.mutate({ userId, isBlocked });
  };

  const openDetailsModal = (user: User) => setSelectedUser(user);
  const closeModal = () => setSelectedUser(null);

  const totalPages = data ? Math.ceil(data.total / recordsPerPage) : 1;

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <div
        className="absolute inset-0 bg-black/10 z-0 opacity-30"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      ></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:px-8">
        <motion.h1
          className="text-3xl font-bold text-white mb-6 ps-4"
          variants={fadeIn}
          transition={{ delay: 0.1 }}
        >
          User Management
        </motion.h1>
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="flex justify-between items-center mb-6 bg-white rounded-lg shadow-md p-4"
        >
          <motion.form
            onSubmit={handleSearch}
            className="flex items-center rounded-lg bg-gray-100"
            variants={fadeIn}
          >
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by username or email..."
              className="px-4 py-2 rounded-l-md focus:outline-none focus:bg-slate-200 bg-transparent text-gray-700"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-r-md hover:bg-purple-700 hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              Search
            </button>
          </motion.form>
          <motion.div
            className="flex items-center rounded-lg bg-gray-100"
            variants={fadeIn}
            transition={{ delay: 0.2 }}
          >
            <label className="mr-2 px-3 py-2 text-gray-700">
              Records per page:
            </label>
            <select
              value={recordsPerPage}
              onChange={(e) => {
                setRecordsPerPage(Number(e.target.value));
                setActivePage(1);
              }}
              className="px-2 py-2 bg-purple-600 text-white rounded-r-md focus:outline-none focus:ring-2 focus:ring-purple-500 hover:bg-purple-700 hover:cursor-pointer"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </motion.div>
        </motion.div>

        <motion.div
          variants={fadeIn}
          className="bg-white shadow rounded-lg overflow-x-auto"
        >
          {isLoading ? (
            <div className="text-center text-lg text-gray-500 py-8">
              Loading users...
            </div>
          ) : error ? (
            <div className="text-center text-lg text-red-500 py-8">
              Error loading users: {error.message}
            </div>
          ) : !data || data.users.length === 0 ? (
            <div className="text-center text-xl text-gray-500 py-8">
              No users found.
            </div>
          ) : (
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <tr>
                  <th className="py-3 px-6 text-left">#</th>
                  <th className="py-3 px-6 text-left">Username</th>
                  <th className="py-3 px-6 text-left">Profile Picture</th>
                  <th className="py-3 px-6 text-left">Email</th>
                  <th className="py-3 px-6 text-center">Status</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm">
                {data.users.map((user, index) => (
                  <motion.tr
                    key={user._id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                    variants={fadeIn}
                    transition={{ delay: 0.1 + index * 0.02 }}
                  >
                    <td className="py-3 px-6 text-left">
                      {(activePage - 1) * recordsPerPage + index + 1}
                    </td>
                    <td className="py-3 px-6 text-left whitespace-nowrap font-medium">
                      {user.username}
                    </td>
                    <td className="py-3 px-6 text-left">
                      <img
                        src={user.profilePicture}
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
                          onClick={() =>
                            handleBlockToggle(user._id, user.isBlocked)
                          }
                          className={`mx-1 rounded-md px-3 py-1 text-xs font-semibold ${
                            user.isBlocked
                              ? "bg-green-500 text-white hover:bg-green-600"
                              : "bg-red-500 text-white hover:bg-red-600"
                          }`}
                          disabled={mutation.isPending}
                        >
                          {user.isBlocked ? "Unblock" : "Block"}
                        </button>
                        <button
                          onClick={() => openDetailsModal(user)}
                          className="bg-blue-500 text-white hover:bg-blue-600 rounded-md px-3 py-1 text-xs font-semibold mx-1"
                        >
                          Details
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}

          {data && data.total > recordsPerPage && (
            <motion.div
              variants={fadeIn}
              className="flex justify-center gap-x-4 items-center mt-6 p-4"
            >
              <button
                onClick={() => setActivePage((prev) => Math.max(prev - 1, 1))}
                disabled={activePage === 1}
                className="px-4 py-2 bg-purple-600 text-white rounded-l-md disabled:bg-gray-400 hover:bg-purple-700"
              >
                Previous
              </button>
              <span>
                Page {activePage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setActivePage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={activePage === totalPages}
                className="px-4 py-2 bg-purple-600 text-white rounded-r-md disabled:bg-gray-400 hover:bg-purple-700"
              >
                Next
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* User Details Modal */}
        {selectedUser && (
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0}}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg w-full max-w-3xl overflow-hidden shadow-lg"
            >
              <div className="flex justify-between items-center px-6 py-4 bg-purple-600 text-white">
                <h2 className="text-xl font-semibold">User Details</h2>
                <button
                  onClick={closeModal}
                  className="text-white hover:text-gray-200 focus:outline-none"
                >
                  ✕
                </button>
              </div>
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="pl-4 pb-5">
                      <img
                        src={selectedUser.profilePicture}
                        alt={selectedUser.username}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Personal Information
                    </h3>
                    <div className="mb-3">
                      <span className="text-gray-600 font-medium">ID:</span>
                      <span className="ml-2">{selectedUser._id}</span>
                    </div>
                    <div className="mb-3">
                      <span className="text-gray-600 font-medium">
                        Username:
                      </span>
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
                      <span className="text-gray-600 font-medium">
                        Joined At:
                      </span>
                      <span className="ml-2">
                        {new Date(selectedUser.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {/* Add more user details here if available */}
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none"
                  >
                    Back
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
      <Footer />
    </motion.div>
  );
};

export default UserManagement;
