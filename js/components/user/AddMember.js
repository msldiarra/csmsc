import React from 'react'
import Relay from 'react-relay'
import AppMessage from '../common/AppMessage';
import SearchVFQ from './SearchVFQ'
import _ from 'lodash';
import AddMemberMutation from '../mutation/AddMemberMutation'


class AddMember extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            members: {},
            errorMessage: '',
            successMessage: ''
        } ;
    }

    onLocationEnter(location) {
        this.setState({locationId: location.id, locationName: location.name, locationRef: location.ref});
    }

    onAddMember(e) {

        e.preventDefault();


        var addMemberMutation = new AddMemberMutation({
            viewer: this.props.viewer,
            viewerId: this.props.viewer.id,
            bureauRef: this.props.bureauRef,
            firstName: this.refs.firstName.value,
            lastName: this.refs.lastName.value,
            nina: this.refs.nina.value,
            contact: this.refs.contact.value,
            locationRef: this.state.locationRef,
        });

        var onSuccess = (response) =>  {

            _.forEach(document.getElementsByClassName('form-control'), (input) => input.value = "")

            this.setState({successMessage : "Enregistré avec succès !", loading: false},
                () => {
                    setTimeout(() => this.setState({successMessage : ""}), 4000)
                });
        }

        var onFailure = (transaction) => this.setState({errorMessage : "Désolé, nous avons rencontré un problème lors de l'enregistrement." +
            " Contactez l'administrateur", loading: false},
            () => {
                setTimeout(() => this.setState({errorMessage : ""}), 4000)
            });

        Relay.Store.commitUpdate(addMemberMutation, {onSuccess, onFailure})

    }


    render() {

        const errorMessage = this.state.errorMessage;
        const successMessage = this.state.successMessage;
        const defaultLocation = '';

        return (
            <div id="addMember" className="modal fade" role="dialog">

                {errorMessage? <AppMessage message={errorMessage} /> : ''}
                {successMessage? <AppMessage message={successMessage} class="success"/> : ''}

                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                            <h3>Ajouter un membre</h3>
                        </div>
                        <div className="modal-body">
                            <form className="form-horizontal padding-20" name="edit-bureau">
                                <div className="col-md-12 center-block">

                                    <div className="form-group col-md-12">
                                        <label className="opacity-87">Prénoms</label>
                                        <div className="input-group col-md-12">
                                            <span className="input-group-addon"></span>
                                            <input type="text" ref="firstName" className="form-control" placeholder="" />
                                        </div>
                                    </div>
                                    <div className="form-group col-md-12">
                                        <label className="opacity-87">Nom de famille</label>
                                        <div className="input-group col-md-12">
                                            <span className="input-group-addon"></span>
                                            <input type="text" ref="lastName" className="form-control" placeholder="" />
                                        </div>
                                    </div>
                                    <div className="form-group col-md-12">
                                        <label className="opacity-87">NINA</label>
                                        <div className="input-group col-md-12">
                                            <span className="input-group-addon"></span>
                                            <input type="text" ref="nina" className="form-control" placeholder="" />
                                        </div>
                                    </div>
                                    <div className="form-group col-md-12">
                                        <label className="opacity-87">Contact</label>
                                        <div className="input-group col-md-12">
                                            <span className="input-group-addon"></span>
                                            <input type="text" ref="contact" className="form-control" placeholder="" />
                                        </div>
                                    </div>
                                    <div className="form-group col-md-12">
                                        <label className="opacity-87">VFQ</label>
                                        <div className="input-group col-md-12">
                                            <span className="input-group-addon"></span>
                                            <SearchVFQ {...this.props} communeRef={this.props.communeRef} defaultValue={defaultLocation}  onLocationEnter={this.onLocationEnter.bind(this)} />
                                        </div>
                                    </div>


                                    <div className="form-group">
                                        <div className="col-md-offset-3 col-md-6">
                                            <button type="button" style={{width:'100%'}} className="btn btn-default" onClick={this.onAddMember.bind(this)} >
                                                {this.state.loading && <div className="text-center"><i className="fa fa-2x fa-spinner" /></div> }
                                                {!this.state.loading && <b>Enregistrer</b>}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            &nbsp;
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


AddMember.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default Relay.createContainer(AddMember, {

    fragments: {
        viewer: () => Relay.QL`
          fragment on Viewer {
               id
               ${SearchVFQ.getFragment('viewer')}
               ${AddMemberMutation.getFragment('viewer')}
          }
    `,
    }
});
