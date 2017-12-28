import React from 'react'
import Relay from 'react-relay'
import AppMessage from '../common/AppMessage';
import MemberEdit from './MemberEdit';
import SearchCommune from './SearchCommune'
import SearchVFQ from './SearchVFQ'
import AttachMedia from './AttachMedia'
import _ from 'lodash';
import AddBureauMutation from '../mutation/AddBureauMutation'
import AttachMediaMutation from '../mutation/AttachMediaMutation'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';


class NewBureau extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            mediaNames: [],
            locationName: '',
            locationRef: '',
            loading: false,
            mandatoryFieldsGiven: false,
            members: {},
            errorMessage: '',
            successMessage: ''
        } ;
    }

    onAddMedia(mediaNames) {
        var names = this.state.mediaNames;
        names.push(mediaNames);
        this.setState({mediaNames: names});
    }

    onMediaInsert(file, uri) {

        var onSuccess = (response) => this.setState({message: "Nouveau document ajouté avec succes!"});
        var onFailure = (transaction) => this.setState({message: transaction});

        Relay.Store.commitUpdate(
            new AttachMediaMutation({
                viewer: this.props.viewer,
                viewerId: this.props.viewer.id,
                uri: uri,
                name: file.name,
                file: file
            }, {onSuccess, onFailure})
        );
    }

    onCreateBureau(e) {

        e.preventDefault();


        if(!this.state.locationRef || !this.refs.bureau.value) {

            this.setState({errorMessage : "Veuiller remplir la commune et le nom du bureau"},
                () => {
                    setTimeout(() => this.setState({errorMessage : ""}), 4000)
                });

            return ;
        }


        var addBureauMutation = new AddBureauMutation({
            viewer: this.props.viewer,
            viewerId: this.props.viewer.id,
            locationRef: this.state.locationRef,
            name: this.refs.bureau.value,
            members: _.values(this.state.members),
            mediaNames: this.state.mediaNames
        });

        var onSuccess = (response) =>  {
            this.context.router.push('/bureau/' + response.addBureauMutation.bureauRef +  '/edit')
        }


        var onFailure = (transaction) => this.setState({errorMessage : "Désolé, nous avons rencontré un problème lors de l'enregistrement." +
            " Contactez l'administrateur", loading: false},
            () => {
                setTimeout(() => this.setState({errorMessage : ""}), 4000)
            });

        Relay.Store.commitUpdate(addBureauMutation, {onSuccess, onFailure})

    }

    onLocationEnter(location) {
        this.setState({locationName: location.name, locationRef: location.ref});
    }

    onMemberFilled(member) {

        let members = this.state.members;

        if(member) {
            members[member.roleId] = member
            this.setState({members : members})
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    render() {

        const errorMessage = this.state.errorMessage;
        const successMessage = this.state.successMessage;

        var members = this.props.viewer.roles.map(function (role) {
            return <MemberEdit viewer={this.props.viewer} key={role.id} role={role} communeRef={this.state.locationRef} onMemberFilled={this.onMemberFilled.bind(this)}/>
        }.bind(this));

        return (
            <div className="">
                <ReactCSSTransitionGroup transitionName="example" transitionAppear={true} transitionAppearTimeout={500} transitionEnterTimeout={0} transitionLeaveTimeout={0}>
                <div className="page-header col-md-6 center-block row">

                </div>

                {errorMessage? <AppMessage message={errorMessage} /> : ''}
                {successMessage? <AppMessage message={successMessage} class="success"/> : ''}

                <form className="form-horizontal padding-20" name="edit-bureau">
                    <div className="page-content row">

                        <div className="col-md-12 center-block">
                            <h3 className="text-center">Nouveau bureau</h3>
                            <br/>
                            <br/>
                        </div>

                        <div className="col-md-6 center-block">
                            <div className="form-group">
                                <div className="col-md-4">
                                    <label className="opacity-87">Commune</label>
                                    <div className="input-group col-md-12">
                                        <SearchCommune {...this.props}  onLocationEnter={this.onLocationEnter.bind(this)} />
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <label className="opacity-87">Bureau</label>
                                    <div className="input-group col-md-12">
                                        <span className="input-group-addon"></span>
                                        <input type="text" ref="bureau" id="bureau" className="form-control" placeholder="" />
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <label className="opacity-87"><br/></label>
                                    <AttachMedia viewer={this.props.viewer} onAddMedia={this.onAddMedia.bind(this)} onMediaInsert={this.onMediaInsert.bind(this)}/>
                                </div>
                            </div>
                        </div>

                        <br/>
                        <br/>

                        <div className="col-md-12 center-block">
                            <div className="form-group">
                                <div className="input-group col-md-12 row">
                                    <div className="col-md-10 center-block">
                                        <div className="panel panel-default">
                                        <table className="table table-bordered table-condensed u">
                                            <thead>
                                                <tr>
                                                    <th>Poste</th>
                                                    <th>Prénoms</th>
                                                    <th>Nom</th>
                                                    <th>NINA</th>
                                                    <th>Contact</th>
                                                    <th>VFQ</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                            {members}
                                            </tbody>
                                        </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="col-md-offset-4 col-md-4">
                                    <button type="button" style={{width:'100%'}} className="btn btn-default" onClick={this.onCreateBureau.bind(this)} >
                                        {this.state.loading && <div className="text-center"><i className="fa fa-2x fa-spinner" /></div> }
                                        {!this.state.loading && <b>Enregistrer le bureau</b>}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
                </ReactCSSTransitionGroup>
            </div>
        );
    }
}


NewBureau.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default Relay.createContainer(NewBureau, {

    fragments: {
        viewer: () => Relay.QL`
          fragment on Viewer {
               id
               roles {
                  id
                  name
               } 
               ${MemberEdit.getFragment('viewer')}
               ${SearchCommune.getFragment('viewer')}
               ${SearchVFQ.getFragment('viewer')}
               ${AddBureauMutation.getFragment('viewer')}
               ${AttachMediaMutation.getFragment('viewer')}
          }
    `,
    }
});
