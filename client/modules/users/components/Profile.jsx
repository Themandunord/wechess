import React from 'react';

import Paper from 'material-ui/Paper';
import Formsy from 'formsy-react';

import { FormsyText } from 'formsy-material-ui';
import RaisedButton from 'material-ui/RaisedButton';

export default class extends React.Component {

  constructor(props){
    super(props);

    this.state= {
      validatePristine: true,
      disabled: false,
      canSubmit: false,
    };
  }

  render() {
    const {i18n} = this.props;

    const styles ={
      page:{
        padding:20,
      },
      button: {
        margin:10,
      },
      submitButton:{
        marginRight:20,
        marginTop: 20,
      },
      errMessage: {
        color: "red",
      },
      row: {
        display: 'block',
        margin: 20
      },
    };

    return (
      <div style={styles.page}>

        <h3>{i18n.Profile}</h3>

      </div>
    );
  }
};
