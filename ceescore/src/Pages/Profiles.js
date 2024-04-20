function Profiles(props) {
  return (
    <div>
      {props.name ? 'No ' + props.name : 'You are not logged in'}
    </div>
  );
}

export default Profiles;
