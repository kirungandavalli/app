
$(function(){

	const state = {
		header : "Welcome to MSC software",
		loggedIn:false,
		employee : null,
		desks : []
	}
	
	
	
	const vm = new Vue({
		el:"#app",
		data :{
			header: "Welcome to Hexagon Software",
			loggedIn:false,
			employee : null,
			desks : [],
			selectedDate : "",
			startTime :"",
			endTime : "",
			selectedDesk : null,
			confirmMsg:"",
			administration:false,
			bookedDates : []
			
			
		},
		computed : {
			blocks : function(){
				return this.groupBy(this.desks, "block");
			}
		},
		methods : {
			containsDate : function(date){
				for(let i =0 ; i < this.bookedDates.length; i++){
						if( this.bookedDates[i] == date) return true;
						
					}
				return false;
			},
			isAfter : function(){
				return moment().diff(this.selectedDate) <=85999999;
			},
			logoff : function(){
				this.loggedIn = false;
				this.username = "",
				this.desks = [],
				this.employee = null;
				this.administration =false;
				this.bookedDates = [];
				
			},
			setDesks : function(desks){
				this.desks = desks;
				this.setEmpDesk(this.getBookedDesk(this.desks));
			},
			setEmpDesk : function(desk){
				this.$root.employee.desk = desk;
				this.$root.$emit('deskBooked', desk);
			},
			getBookedDesk : function(desks){
				let emp = this.employee;
				
				for(let i =0 ; i < desks.length; i++){
					let desk = desks[i];
					if(desk.employee && desk.employee.id === emp.id){
						return desk;
					}
				}
				return null;
				
			},
			getDesks : function(){
				return this.desks;
			},
			getDeskById : function(desks, id){
				for(let i = 0 ; i < desks.length ; i++){
					if(desks[i].id === id)
						return desks[i];
				}
				return null;
			},
			book : function(id){
				let _self = this;
				let param = {
		    		empId : this.employee.id,
		    		deskId : this.selectedDesk,
		    		startTime : this.startTime,
		    		endTime : this.endTime
		    		
	    		};
	    		let desk = this.getDeskById(this.getDesks(), this.selectedDesk);
				fetch("/employee/book",{
						method:"POST", 
						body : JSON.stringify(param),
						headers: {
						    'Content-Type': 'application/json',
						     dataType: "json"
						  }
						}).then(function(response){
					response.json().then(function(data) {
						_self.selectedDesk = null;
						desk.bookingId = data.id;
	       	 			_self.setEmpDesk(desk);
	       	 			desk.employee = _self.employee;
	       	 			_self.bookedDates.push(_self.selectedDate.get('date'));
	       	 			_self.confirmMsg = "Your booking has been confirmed";
	       	 			$('#ConfirmAlert').modal('show');
	     	 		});
				});
				
			},
			releaseDesk : function(id){
				var _self = this;
				fetch("/employee/release/"+id,{
							method:"GET", 
							headers: {
							    'Content-Type': 'application/json',
							     dataType: "json"
							  }
							}).then(function(response){
								var index = _self.bookedDates.indexOf(_self.selectedDate.get('date'));
								
								_self.bookedDates.splice(index,1);
		       	 			
			     	 		}).then(function(){
								let param = {
							    		empId : _self.employee.id,
							    		startTime : _self.startTime,
							    		endTime : _self.endTime
						    		};
								fetch("/desks",{
										method:"POST", 
										body : JSON.stringify(param),
										headers: {
										    'Content-Type': 'application/json',
										     dataType: "json"
										  }
										}).then(function(response){
											response.json().then(function(data) {
												_self.setDesks(data.desks);	
												// TODO parking		       	 			
							     	 		});
										});
								});
						
					
				
			},
			refreshDesks: function(){
				var self = this;
				this.selectedDesk = null;
				let param = {
				    		empId : this.employee.id,
				    		startTime : this.startTime,
				    		endTime : this.endTime
			    		};
				fetch("/desks",{
						method:"POST", 
						body : JSON.stringify(param),
						headers: {
						    'Content-Type': 'application/json',
						     dataType: "json"
						  }
				}).then(function(response){
							response.json().then(function(data) {
								self.setDesks(data.desks);	
								// TODO parking		       	 			
			     	 		});
						});
			},
			groupBy : function(list, key){
				const result = {};
				list.forEach(item => {
					if (!result[item[key]]){
						result[item[key]] = [];
					}
					result[item[key]].push(item);
					});
				return result;
			}
		}
	});
});