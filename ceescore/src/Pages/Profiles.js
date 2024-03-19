const Profiles = (props) => {
 
    return(

      <div>
      Hi {props.name ? 'Hi ' + props.name : 'You are not logged in'}
      </div>
    );
    };

    export default Profiles;
