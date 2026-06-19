import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router'
import MainLayout from './layouts/MainLayout.jsx'
import AuthProvider from './contexts/AuthProvider.jsx'
import SignIn from './components/social/SignIn.jsx'
import SignUp from './components/social/SignUp.jsx'
import Home from './components/home/home/Home.jsx'
import QueryProvider from './providers/QueryProvider.jsx'
import DashboardLayout from './layouts/DashboardLayout.jsx'
import AdminDashboard from './components/dashboard/pages/admin/dashboard/AdminDashboard.jsx'
import UserDashboard from './components/dashboard/pages/user/dashboard/UserDashboard.jsx'
import Dashbaord from './components/dashboard/pages/role-dashboard/Dashbaord.jsx'
import ManagerUsers from './components/dashboard/pages/admin/users/ManagerUsers.jsx'
import ConnectApi from './components/dashboard/pages/admin/system/ConnectApi.jsx'
import ApiList from './components/dashboard/pages/admin/apiList/ApiList.jsx'
import Buy from './components/navitem/buy/Buy.jsx'
import Rent from './components/navitem/rent/Rent.jsx'
import Sell from './components/navitem/sell/Sell.jsx'
import JoinAgent from './components/navitem/agent/join-agent/JoinAgent.jsx'
import TopratedAgent from './components/navitem/agent/toprated-agent/TopratedAgent.jsx'
import Contact from './components/navitem/contact/Contact.jsx'
import CustomerReview from './components/home/customer-review/CustomerReview.jsx'
import AllCities from './components/all-cities/AllCities.jsx'
import AddProperty from './components/dashboard/pages/admin/add-property/AddProperty.jsx'
import PropertyDetails from './components/property-details/PropertyDetails.jsx'
import PropertyList from './components/dashboard/pages/admin/property-list/PropertyList.jsx'
import EditProperty from './components/dashboard/pages/admin/property-list/EditProperty.jsx'
import AgentDashboard from './components/dashboard/pages/agent/dashboard/AgentDashboard.jsx'
import PendingProperties from './components/dashboard/pages/admin/pending-properties/PendingProperties.jsx'
import AssignedProperties from './components/dashboard/pages/agent/assigned-properties/AssignedProperties.jsx'
import AgentDeals from './components/dashboard/pages/agent/agent-deals/AgentDeals.jsx'
import AgentConversations from './components/dashboard/pages/agent/agent-conversations/AgentConversations.jsx'
import UserConversations from './components/dashboard/pages/user/user-conversations/UserConversations.jsx'
import MyDeals from './components/dashboard/pages/user/user-deals/MyDeals.jsx'
import MyTransactions from './components/dashboard/pages/user/user-transactions/MyTransactions.jsx'
import AgentTransactions from './components/dashboard/pages/agent/agent-transactions/AgentTransactions.jsx'
import Transactions from './components/dashboard/pages/admin/admin-transactions/Transactions.jsx'
import MyProfile from './components/navitem/my-profile/MyPofile.jsx'
import LearnMore from './components/home/featured-sell/LearnMore.jsx'
import AgentList from './components/dashboard/pages/admin/agent-list/AgentList.jsx'
import AgentRequest from './components/dashboard/pages/admin/agent-list/AgentRequest.jsx'
import SearchedList from './components/home/hero/SearchedList.jsx'





const router = createBrowserRouter([
  {
    path: '/',
    Component: MainLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: 'signin',
        Component: SignIn,
      },
      {
        path: 'signup',
        Component: SignUp,
      },
      {
        path: 'searched-list/:id',
        Component: SearchedList,
      },
      {
        path: 'buy',
        Component: Buy,
      },
      {
        path: 'rent',
        Component: Rent,
      },
      {
        path: 'sell',
        Component: Sell,
      },
      {
        path: 'join-agent',
        Component: JoinAgent,
      },
      {
        path: 'toprated-agent',
        Component: TopratedAgent,
      },
      {
        path: 'contact',
        Component: Contact,
      },
      {
        path: 'learn-more',
        Component: LearnMore,
      },
      {
        path: 'customer-review',
        Component: CustomerReview,
      },
      {
        path: 'all-cities',
        Component: AllCities,
      },
      {
        path: 'my-profile',
        Component: MyProfile,
      },
      {
        path: 'property/:id',
        Component: PropertyDetails,
      },
      {
        path: 'property/edit-property/:id',
        Component: EditProperty,
      },
    ]
  },






  {
    path: '/dashboard',
    Component: DashboardLayout,
    children: [
      {
        index: true,
        Component: Dashbaord,
      },


      //admin path
      {
        path: 'admin-dashboard',
        Component: AdminDashboard,
      },
      {
        path: 'manage-users',
        Component: ManagerUsers,
      },
      {
        path: 'add-property',
        Component: AddProperty,
      },
      {
        path: 'property-list',
        Component: PropertyList,
      },
      {
        path: 'pending-properties',
        Component: PendingProperties,
      },

      {
        path: 'connect-api',
        Component: ConnectApi,
      },
      {
        path: 'api-list',
        Component: ApiList,
      },
      {
        path: 'transactions',
        Component: Transactions,
      },
      {
        path: 'agent-list',
        Component: AgentList,
      },
      {
        path: 'agent-request',
        Component: AgentRequest,
      },






      //agent path
      {
        path: 'agent-dashboard',
        Component: AgentDashboard,
      },
      {
        path: 'assigned-properties',
        Component: AssignedProperties,
      },
      {
        path: 'conversations',
        Component: AgentConversations,
      },
      {
        path: 'agent-deals',
        Component: AgentDeals,
      },
      {
        path: 'agent-transactions',
        Component: AgentTransactions,
      },




      //user path
      {
        path: 'user-dashboard',
        Component: UserDashboard,
      },
      {
        path: 'my-conversations',
        Component: UserConversations,
      },
      {
        path: 'my-deals',
        Component: MyDeals,
      },
      {
        path: 'my-transactions',
        Component: MyTransactions,
      },

    ]
  }

])


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryProvider>
  </StrictMode>
)

