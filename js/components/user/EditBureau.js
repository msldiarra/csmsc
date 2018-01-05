import React from 'react'
import Relay from 'react-relay'
import {fromGlobalId} from 'graphql-relay';
import AppMessage from '../common/AppMessage';
import MemberEdit from './MemberEdit';
import SearchCommune from './SearchCommune'
import SearchVFQ from './SearchVFQ'
import MediaList from './MediaList'
import AttachMedia from './AttachMedia'
import AddMember from './AddMember'
import _ from 'lodash';
import EditBureauMutation from '../mutation/EditBureauMutation'
import DeleteMediaMutation from '../mutation/DeleteMediaMutation'
import AttachMediaMutation from '../mutation/AttachMediaMutation'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';



class EditBureau extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            mediaNames: [],
            locationId: '',
            locationName: '',
            locationRef: '',
            loading: false,
            allFieldsGiven: false,
            members: {},
            errorMessage: '',
            successMessage: ''
        } ;
    }

    onViewMembers(e){
        e.preventDefault()
        this.context.router.push(`/bureau/${this.props.reference}/members`)
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

    onEditBureau(e) {

        e.preventDefault();

        if(!this.state.locationRef || !this.refs.bureau.value) {

            this.setState({errorMessage : "Veuiller remplir la commune et le nom du bureau"},
                () => {
                    setTimeout(() => this.setState({errorMessage : ""}), 4000)
                });

            return ;
        }

        var editBureauMutation = new EditBureauMutation({
            viewer: this.props.viewer,
            viewerId: this.props.viewer.id,
            locationRef: this.state.locationRef,
            bureauId: this.props.viewer.bureau.id,
            ref: this.props.viewer.bureau.ref,
            name: this.refs.bureau.value,
            members: _.values(this.state.members),
            mediaNames: this.state.mediaNames,

        });

        var onSuccess = () =>  this.setState(
            {successMessage : "Enregistré avec succès !", loading: false},
            () => {
                setTimeout(() => this.setState({successMessage : ""}), 4000)
            }
        );

        var onFailure = (transaction) => this.setState({errorMessage : "Désolé, nous avons rencontré un problème lors de l'enregistrement." +
            " Contactez l'administrateur", loading: false},
            () => {
                setTimeout(() => this.setState({errorMessage : ""}), 4000)
            });

        Relay.Store.commitUpdate(editBureauMutation, {onSuccess, onFailure})

    }

    deleteMedia(mediaId, mediaName) {

        var deleteMediaMutation = new DeleteMediaMutation({
            viewer: this.props.viewer,
            viewerId: this.props.viewer.id,
            mediaId: mediaId,
            mediaName: mediaName
        });

        var onSuccess = () =>  this.setState(
            {successMessage : "Document supprimé!", loading: false},
            () => {
                setTimeout(() => this.setState({successMessage : ""}), 4000)
            }
        );

        var onFailure = (transaction) => this.setState({message : "Désolé, nous avons rencontré un problème lors de l'enregistrement." +
        " Contactez l'administrateur"});

        Relay.Store.commitUpdate(deleteMediaMutation, {onSuccess, onFailure})

    }

    onLocationEnter(location) {
        this.setState({locationId: location.id, locationName: location.name, locationRef: location.ref});
    }

    onMemberFilled(member) {

        let members = this.state.members;

        if(member) {
            members[member.roleId] = member
            this.setState({members : members})
        }
    }



    componentDidMount() {

        let members = {};

        this.props.viewer.bureau.members.map(function (member) {

            members[member.role.id] = {
                'roleId': member.role.id,
                'firstName': member.firstName,
                'lastName': member.lastName,
                'nina': member.nina,
                'contact': member.contact,
                'locationId': fromGlobalId(member.location.id).id
            }

        })

        this.setState({members: members});
        window.scrollTo(0, 0);
    }

    render() {

        const errorMessage = this.state.errorMessage;
        const successMessage = this.state.successMessage;
        let members = this.props.viewer.bureau.members;
        let defaultLocation = this.state.locationRef ? {id: this.state.locationId, ref: this.state.locationRef, name: this.state.locationName} : this.props.viewer.bureau.location;
        let defaultName = this.props.viewer.bureau.name;

        let media = this.props.viewer.bureau.media.edges;
        let mediaList = '';

        if(media && media.length > 0) {
            mediaList = <MediaList media={media} onDeleteMedia={this.deleteMedia.bind(this)}/>
        }


        var roles = this.props.viewer.roles.map(function (role) {

            let filtered = _.filter(members, (saved) => {
                return saved.role.name == role.name
            });

            const member = filtered ? filtered[0] : undefined;

            return <MemberEdit viewer={this.props.viewer}
                           key={role.id} role={role}
                           member={member}
                           communeRef={defaultLocation.ref}
                           onMemberFilled={this.onMemberFilled.bind(this)}/>
        }.bind(this));


        return (
            <div className="">
                <ReactCSSTransitionGroup transitionName="example" transitionAppear={true} transitionAppearTimeout={500} transitionEnterTimeout={0} transitionLeaveTimeout={0}>
                <div className="page-header col-md-6 center-block row">

                </div>

                {errorMessage? <AppMessage message={errorMessage} /> : ''}
                {successMessage? <AppMessage message={successMessage} class="success"/> : ''}

                <form className="form-horizontal padding-20" name="add-property">
                    <div className="page-content row">
                        <div className="col-md-12 center-block">
                            <h3 className="text-center">Bureau <b>{this.props.viewer.bureau.name}</b> &nbsp;&nbsp;
                                <button type="button" className="btn btn-default" onClick={this.onViewMembers.bind(this)} >
                                    <i className="fa fa-users opacity-54"></i>{'  Voir la liste des membres'}
                                </button>
                            </h3>
                            <br/>
                            <br/>
                        </div>

                        <div className="col-md-10 center-block">
                            <div className="form-group">
                                <div className="col-md-3">
                                    <label className="opacity-87">Commune</label>
                                    <div className="input-group col-md-12">
                                        <SearchCommune {...this.props} defaultValue={defaultLocation} onLocationEnter={this.onLocationEnter.bind(this)} />
                                    </div>
                                </div>
                                <div className="col-md-2">
                                    <label className="opacity-87">Bureau</label>
                                    <div className="input-group col-md-12">
                                        <span className="input-group-addon"></span>
                                        <input type="text" ref="bureau" id="bureau" className="form-control" placeholder="" defaultValue={defaultName} />
                                    </div>
                                </div>
                                <div className="col-md-2">
                                    <label className="opacity-87"><br/></label>
                                    <AttachMedia viewer={this.props.viewer} onAddMedia={this.onAddMedia.bind(this)} onMediaInsert={this.onMediaInsert.bind(this)}/>
                                </div>
                                <div className="col-md-3">
                                    <label className="opacity-87"><br/></label>
                                    <div className="input-group col-md-12">
                                        {mediaList}
                                    </div>
                                </div>
                                <div className="col-md-2">
                                    <label className="opacity-87">&nbsp;</label>
                                    <div className="input-group col-md-12">
                                        <button type="button" style={{width:'100%'}} className="btn btn-default" data-toggle="modal" data-target="#addMember" >
                                            <i className="fa fa-user-plus"></i> &nbsp; Ajouter un membre
                                        </button>
                                    </div>
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
                                            <thead className="">
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
                                            {roles}
                                            </tbody>
                                        </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="col-md-offset-4 col-md-4">
                                    <button type="button" style={{width:'100%'}} className="btn btn-default" onClick={this.onEditBureau.bind(this)} >
                                        {this.state.loading && <div className="text-center"><i className="fa fa-2x fa-spinner" /></div> }
                                        {!this.state.loading && <b>Modifier le bureau</b>}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
                </ReactCSSTransitionGroup>
                <AddMember bureauRef={this.props.viewer.bureau.ref} communeRef={defaultLocation.ref} {...this.props}/>
            </div>
        );
    }
}


EditBureau.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default Relay.createContainer(EditBureau, {

    initialVariables: {reference: ''},

    fragments: {
        viewer: (vars) => Relay.QL`
          fragment on Viewer {
               id
               roles {
                  id
                  name
               }
               bureau(ref: $reference) {
                  id
                  ref
                  name
                  location {
                       id
                       ref
                       name
                  }
                  media(first: 5){
                    edges {
                        node {
                          id
                          uri
                          name
                          mime_type
                        }   
                    }
                  }
                  members {
                    id
                    firstName
                    lastName
                    nina
                    contact
                    location {
                       id
                       ref
                       name
                    }
                    role {
                       id
                       name
                    }
                  }
               } 
               ${MemberEdit.getFragment('viewer', vars)}
               ${AddMember.getFragment('viewer', vars)}
               ${SearchVFQ.getFragment('viewer', vars)}
               ${SearchCommune.getFragment('viewer', vars)}
               ${EditBureauMutation.getFragment('viewer', vars)}
               ${AttachMediaMutation.getFragment('viewer', vars)}
               ${DeleteMediaMutation.getFragment('viewer', vars)}
          }
    `,
    }
});
