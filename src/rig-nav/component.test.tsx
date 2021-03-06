import { setupShallowTest } from '../tests/enzyme-util/shallow';
import { RigNavComponent } from '.';
import { LoginButton } from '../login-button';
import { RigProject } from '../core/models/rig';
import { UserDropdown } from '../user-dropdown';
import { createExtensionManifestForTest } from '../tests/constants/extension';

const defaultGenerator = () => ({
  openConfigurationsHandler: jest.fn(),
  configHandler: jest.fn(),
  liveConfigHandler: jest.fn(),
  openProductManagementHandler: jest.fn(),
  manifest: createExtensionManifestForTest(),
  session: { displayName: 'test', login: 'test', id: 'test', profileImageUrl: 'test.png', authToken: 'test' },
  mockApiEnabled: false,
  currentProjectIndex: 0,
  projects: [] as RigProject[],
  createNewProject: () => { },
  deleteProject: jest.fn(),
  selectProject: (_projectIndex: number) => { },
});

const setupShallow = setupShallowTest(RigNavComponent, defaultGenerator);

describe('<RigNavComponent />', () => {
  it('renders correctly', () => {
    const { wrapper } = setupShallow();
    expect(wrapper).toMatchSnapshot();
  });

  it('invokes deleteProject', () => {
    const { wrapper } = setupShallow();
    wrapper.find('.personal-bar__button').first().simulate('click');
    expect(wrapper.instance().props.deleteProject).toHaveBeenCalled();
  });

  it('correct css classes are set when things are selected', () => {
    const { wrapper } = setupShallow();
    wrapper.find('a.top-nav-item').forEach((tab: any) => {
      tab.simulate('click');
      expect(wrapper.find('.top-nav-item__selected')).toHaveLength(1);
    });
  });

  it('renders login button if no session', () => {
    const { wrapper } = setupShallow({
      session: undefined,
    });
    expect(wrapper.find(LoginButton));
  });

  it('renders user dropdown if session exists', () => {
    const { wrapper } = setupShallow();
    expect(wrapper.find(UserDropdown));
  });

  it('disables product management tab when user is not logged in', () => {
    const { wrapper } = setupShallow({
      session: undefined,
    });
    expect(wrapper.find('.top-nav-item__disabled')).toHaveLength(2);
  });

  it('disables product management tab when extension is not bits enabled', () => {
    const { wrapper } = setupShallow({
      manifest: {
        ...createExtensionManifestForTest(),
        bitsEnabled: false,
      },
    });
    expect(wrapper.find('.top-nav-item__disabled')).toHaveLength(2);
  });
});
