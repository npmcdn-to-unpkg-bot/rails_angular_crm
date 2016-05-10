angular.module('crm').config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('contacts', {
                url:'/contacts',
                params: {contacts_array:null,
                         index:null,
                         keywords:null
                },
                views: {'content@': {
                    templateUrl: 'contacts.html',
                    controller  : 'ContactsController',
                    controllerAs: 'contacts',
                    /* used the promise in order to wait for resolve to be resolved. Othewise, if success and failure would have been
                        included in the query it would have triggered the infinite scroll into an infinite loop of query*/
                    resolve: {contacts: ['contactFactory', '$stateParams', function(contactFactory, $stateParams) {
                        if ($stateParams.contacts_array==null && $stateParams.keywords==null) {
                              return contactFactory.getContact().query({limit: 5}).$promise.then( 
                                  function(response){
                                     return response;
                              }, function(response) {
                                   console.log(response.statusText);
                              });
                         
                        } else {
                            
                            if (($stateParams.contacts_array!=null && $stateParams.keywords==null) || ($stateParams.contacts_array!=null && $stateParams.keywords!=null)) {
                               console.log($stateParams.contacts_array);
                                return $stateParams.contacts_array;
                            }  else {
                              return contactFactory.getContact().query($stateParams.keywords).$promise.then( 
                                  function(response){
                                      console.log("INSIDE 2");
                                     return response;
                              }, function(response) {
                                   console.log(response.statusText);
                              });
                          } 
                        }
                    }],
                        index: ['$stateParams', function($stateParams) {
                            return $stateParams.index;
                        }],
                        keywords: ['$stateParams', function($stateParams) {
                            return $stateParams.keywords==null ? null : $stateParams.keywords;
                        }]
                    }
                    
                }}
                
            })
            .state('contacts.search', {
                url:'/search',
                params: { contacts_array: null,
                          contact: null,
                          source: null
                    
                },
                views:{'content@':{
                    templateUrl: 'search.html',
                    controller: 'searchContactController',
                    controllerAs: 'search',
                    resolve:{contacts_array: ['$stateParams', function($stateParams) {
                        return $stateParams.contacts_array;                    
                    }],
                      one_contact: ['$stateParams', function($stateParams) {
                          return $stateParams.contact;
                      }],
                      origin: ['$stateParams', function($stateParams) {
                          return $stateParams.source;
                      }]
                    }
                }}
            }) 
            .state('contacts.contact-detail', {
                url:'/:id',
                
                // define the url parameter & index that will store the contacts array used in order to navigate left or right
               
                params: { contacts: null,
                          keywords: null
                }, 
                views: {'content@':{
                    templateUrl: 'contact.html',
                    controller: 'ContactController',
                    controllerAs: 'contact',
                    resolve: {one_contact:  ['contactFactory', '$stateParams', function(contactFactory, $stateParams) {
                        var parameter="show"
                        return contactFactory.getContact(parameter).get({id:parseInt($stateParams.id)}, 
                          function(response){
                             return response;
                      }, function(response) {
                           console.log(response.statusText);
                      });
                    }],
                    
                        // retrieve the contacts array & and the index of the array from the url parameters
                        contacts: ['$stateParams', function($stateParams) {
                            return $stateParams.contacts;
                        }],
                        keywords: ['$stateParams', function($stateParams) {
                            return $stateParams.keywords;
                        }]
                    }
                }}
            })
            
            $urlRouterProvider.otherwise('/');
    })