interface UserDataSettings{
  saveOnClose: boolean;
  saveOnSend:boolean;

}
interface UserData {
  settings: UserDataSettings;
}
interface User {
  id: number;
  username: String;
  data: UserData;
}

export default User;
