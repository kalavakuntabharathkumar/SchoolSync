import { gql } from '@apollo/client';
export const DASHBOARD = gql`query Dashboard($role: Role!, $userId: ID!) { dashboard(role:$role,userId:$userId) { role displayName classes { id name timetable { id day period subject room } } announcements { id title body audience createdAt } } }`;
