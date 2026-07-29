import type { NavigatorScreenParams } from '@react-navigation/native';

// Backend role slugs carried through the onboarding flow.
export type RoleSlug = 'student' | 'hub_tutor' | 'help_tutor';

// Bottom tab routes (main app)
export type TabParamList = {
  Home: undefined;
  Class: undefined;
  Tutors: undefined;
  Compete: undefined;
  Group: undefined;
};

// Root stack: onboarding flow then the tabbed app.
// Detail screens live here so they cover the tab bar (as in the prototype,
// where tutor-detail hides the bottom nav).
// The chosen role is threaded Role -> Package -> CreateAccount so signup can
// send it to the backend.
export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Role: undefined;
  Package: { role: RoleSlug } | undefined;
  CreateAccount: { role: RoleSlug } | undefined;
  Main: NavigatorScreenParams<TabParamList> | undefined;
  TutorDetail: { tutorName: string };
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
