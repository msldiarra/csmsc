import React from 'react'
import Relay from 'react-relay'
import SearchLocation from './SearchLocation'

class BureauList extends React.Component {


    constructor(props) {

        super(props);
        this.state = {
            locationId: '',
            locationName: '',
            locationRef: '',
            message: ''
        } ;
    }

    onLocationEnter(location) {
        this.props.relay.setVariables({locationRef: location.ref})
    }

    handleClick(e) {

        e.preventDefault()

        let target = e.target;

        while(target && target.parentNode.tagName != 'UL') {
            target = target.parentNode;
            if(!target) return;
        }

        const ref = target.getAttribute('data-ref');
        this.context.router.push('/bureau/' + ref  +  '/edit')
    }


    render() {


        let bureauList = this.props.viewer.bureauList.edges.map(function (edge){

            return (
                <li key={edge.node.id} data-id={edge.node.id} data-ref={edge.node.ref}
                    onClick={this.handleClick.bind(this)}>
                    <div>Bureau <b>{edge.node.name}</b>
                        <span style={{float:'right'}} className="opacity-54">
                            <i className="fa fa-chevron-right" aria-hidden="true"></i>
                        </span>
                    </div>
                </li>
            )}.bind(this));


        if(bureauList == "") {
            bureauList = (
                <div className="col-md-12 center-block text-center opacity-54">
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <i className="fa fa-3x fa-users"></i>
                    <h3>Aucun bureau trouvé</h3>
                </div>
            )
        }


        return (
            <div className="container">
                <div className="page-header col-md-12 center-block">
                    <br/>
                    <br/>
                </div>

                <div className="col-md-12">
                    <div className="form-group">
                        <div className="col-md-4 center-block">
                            <label className="opacity-87">Localité</label>
                            <div className="input-group col-md-12">
                                <SearchLocation {...this.props}  onLocationEnter={this.onLocationEnter.bind(this)} />
                            </div>
                        </div>
                    </div>
                </div>


                <div className="col-md-12 min-height">
                        <div className="col-md-6 center-block details">
                            <ul className="col-md-12">
                                <li><h3 className="text-center">Liste des bureaux</h3></li>
                                {bureauList}
                            </ul>
                        </div>
                </div>

            </div>
        );
    }
}

BureauList.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default Relay.createContainer(BureauList, {

    initialVariables: {locationRef: ''},

    fragments: {
        viewer: (vars) => Relay.QL`
          fragment on Viewer {
               bureauList(locationRef: $locationRef, first:50) {
                  edges {
                    node {
                      id
                      ref
                      name
                    }   
                  }
               }
               ${SearchLocation.getFragment('viewer', vars)}
          }
    `,
    }
});