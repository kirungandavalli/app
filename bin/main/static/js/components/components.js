Vue.component("login",{
	data : function(){
		return {
			username : "",
			password : "",
			dateContext: moment()
			
		};
	},
	computed: {
		year: function () {
	        var t = this;
	        return t.dateContext.format('Y');
	    },
	   
	    monthNumber: function () {
	        var t = this;
	        return t.dateContext.format('MM');
	    },
		
	    currentDate: function () {
	        var t = this;
	        return t.dateContext.get('date');
	    }	
	      
	    
	},
	methods :{
		
		login : function(){
			var comp = this;
			var root = this.$root;
			let sTime = this.$root.startTime = new Date(this.year, this.monthNumber-1, this.currentDate, "00","01","01").getTime();
	    	let eTime = this.$root.endTime =  new Date(this.year, this.monthNumber-1, this.currentDate, "23","59","59").getTime();
 			this.$root.selectedDate = moment().year(this.year).month(this.monthNumber-1).date(this.currentDate);
			fetch("/employee/"+comp.username,{method:"GET"}).then(function(response){
				response.json().then(function(data) {
       	 			console.log(data);
       	 			root.employee = data;
		 			root.loggedIn = true;
		  			root.username = root.employee.name;
	     			root.selectedDesk = null;	
	       	
     	 		}).then(function(){
     	 			
					let param = {
				    		empId : root.employee.id,
				    		startTime : sTime,
				    		endTime : eTime
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
									root.setDesks(data.desks);	
									// TODO parking		       	 			
				     	 		});
							});
						});
				});
			
		}
	},
	
	template : `
		<div class="login-form">
			<form @submit.prevent="login">
				<h2 class="text-center">Login</h2> 
				<div class="form-group">
					<input type="text" class="form-control"  placeholder="Username"
						required="required" v-model="username">
				</div>
				<div class="form-group">
					<input type="password" class="form-control "  placeholder="Password"
						required="required" v-model="password">
				</div>
				<div class="form-group">
					<button type="submit" class="btn btn-primary btn-block">Log
						in</button>
				</div>
				
			
			</form>
		</div>
	
	`

});


Vue.component("banner",{
	props :["employee", "bannertitle"],
	data : function(){
		return {};
	},
	methods:{
		logoff: function(){
			this.$root.logoff();
			return true;
		},
		gotoAdministration: function(){
			this.$root.administration = true;
		},
		gotoBooking: function(){
			this.$root.administration = false;
		}
	},
	
	template : `
		<nav class="navbar navbar-expand-lg navbar-light bg-light banner">
			<span class="header" href="#">{{bannertitle}}</span>
			<div class="collapse navbar-collapse" id="navbarText">
				<ul class="navbar-nav mr-auto">
				</ul>
				<div class="dropdown clickable" v-if="employee && employee.department === 'Admin'">
					<span class="header dropdown dropdown-toggle" role="button"  data-toggle="dropdown" id="usermenu" v-if="employee" aria-haspopup="true" aria-expanded="false"> 
					{{employee.name}} </span> 
					<div class="dropdown-menu" aria-labelledby="usermenu">
					  <span class="dropdown-item" @click="gotoAdministration()" >Administration</span>
					  <span class="dropdown-item" @click="gotoBooking()" >Booking</span>
					  
					</div>
				</div>
				<span class="header"  v-if="employee && employee.department !== 'Admin'"> 
					{{employee.name}} </span>
					
				<span class="header" > &nbsp; | &nbsp;</span>	
				<span class="header clickable" data-toggle="modal" data-target="#logoffConfirm">Logoff</span>
				
				
			</div>
			<div class="modal fade" id="logoffConfirm" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
			  <div class="modal-dialog" role="document">
			    <div class="modal-content">
			      <div class="modal-header">
			        <h5 class="modal-title" id="exampleModalLabel">Confirm</h5>
			        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
			          <span aria-hidden="true">&times;</span>
			        </button>
			      </div>
			      <div class="modal-body">
			        Are you sure you want to logoff ?
			      </div>
			      <div class="modal-footer">
			        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
			        <button type="button" class="btn btn-primary" data-dismiss="modal" @click="logoff()">Ok</button>
			      </div>
			      
			    </div>
			  </div>
			</div>
		</nav>
	`
});

Vue.component("desk-container", {
	props :["desks"],
	name : "desk-container",
	data: function(){
		return {};
	},
	created : function(){
		
	},
	computed : {
		blocks : function(){
				return this.groupBy(this.desks, "block");
			}	
			
	},
	methods : {
		getDeskClass : function(desk){
			if(desk.active && !desk.booked && !desk.alarming)
				return "btn-success clickable";
			else if(desk.booked)
				return "btn-primary";	
			else if(desk.alarming)
				return "btn-secondary";
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
		
	},
	
	template : `
	<div id="accordion">
		<div class="card" v-for="group, block, index in blocks" :class="">
			<div class="card-header" :id="block" data-toggle="collapse" :data-target="'#'+block+index" :aria-expanded="index == 0" :aria-controls="block+index">{{block}}</div>
			<div class=" card-body collapse" :class="{'show' : index == 0 , ' Readonly ' :!$root.isAfter()} " :id="block+index" :aria-labelledby="block" data-parent="#accordion">
				<desk :desk="desk" v-for="desk in group" :key="desk.id"></desk>
			</div>
		</div>
	</div>
	
	`
});

Vue.component("desk", {
	props :["desk"],
	name : "desk",
	data: function(){
		return {};
	},
	methods : {
		getAllDesks: function(){
			return this.$root.getDesks();
		},
		getDeskById : function(id){
			var desks = this.getAllDesks();
			return this.$root.getDeskById(desks, id);
		},
		getDeskClass : function(desk){
			if(this.$root.selectedDesk === desk.id)
				return "btn-warning clickable";
			if(this.$root.selectedDesk !== desk.id && desk.active && !desk.employee && !desk.danger && !desk.cDanger)
				return "btn-success clickable";
			else if(desk.active && desk.employee)
				return "btn-primary";
					
			else 
				return "btn-secondary";
		},
		
		select : function(){
			if(this.$root.employee.desk || !this.$root.isAfter()) return;
			this.resetAlarming();
			if(this.$root.selectedDesk == this.desk.id){
				this.$root.selectedDesk = null;
				this.$parent.$forceUpdate(); 
				this.$forceUpdate(); 
				return;
			}
			
			if(this.desk.active && this.desk){
				this.$root.selectedDesk = this.desk.id;
				this.applyAlarming();
			}
			this.$parent.$forceUpdate(); 
			this.$forceUpdate(); 
		},
		
		resetAlarming : function(){
			if(!this.$root.selectedDesk) return;
			let desk = this.getDeskById(this.$root.selectedDesk);
			let alarming = desk.alarming;
			if(!alarming) return;
			let list = alarming.split(",");
			for(let i =0 ; i < list.length; i++){
				this.getDeskById(list[i]).cDanger = false;
			}
		},
		
		applyAlarming : function(){
			let desk = this.getDeskById(this.$root.selectedDesk);
			let alarming = desk.alarming;
			if(!alarming) return;
			let list = alarming.split(",");
			for(let i =0 ; i < list.length; i++){
				this.getDeskById(list[i]).cDanger = true;
			}
		}
		
	},
	
	template : `
	<span  :title="desk.employee ? desk.employee.name + ' : ' + desk.employee.department : ''" class="badge Desk" @click="!desk.employee && !desk.danger && select()" :class="getDeskClass(desk)"   data-toggle="modal" data-target="#deskModal" :data-deskid="desk.id">
  		{{desk.id}}
	</span>
	
	`
});

Vue.component("employee-dashboard",{
	props:["emp"],
	data : function(){
		return {
			employee : this.emp,
			counter: 0
		}
	},
	name : "emp-container",
	
	methods:{
		releaseDesk(bookingId){
			this.$root.releaseDesk(bookingId);
		}
		
	},
	created() {
		let _self = this;
	    this.$root.$on('deskBooked', (desk) => {
	      _self.employee.desk = desk;
	      _self.$forceUpdate();
	    })
  	},
  	
	template:`
		<div>
			<div class="card">
				<div class="card-body">
					<calander></calander>
				</div>
			</div>
			<div class="card" ref="employee">
				<div class="card-header">Booked Desk</div>
				<div class="card-body"  v-if="employee && employee.desk" :key="counter">
					<span class="badge Desk btn-primary" :title="employee.desk.id"> {{employee.desk.id}}
						<span class="badge ReleaseCard" v-if="$root.isAfter()" data-toggle="modal" data-target="#releaseDialog"
						>X</span>
					</span>
				</div>
				<div class="card-body" v-if="!employee || !employee.desk">
					<span class="badge"> No desk is booked</span> </span>
				</div>
			</div>
			<div class="modal fade" id="releaseDialog" tabindex="-1" role="dialog"
			aria-labelledby="exampleModalLabel" aria-hidden="true">
				<div class="modal-dialog" role="document">
					<div class="modal-content">
						<div class="modal-header">
							<h5 class="modal-title" id="exampleModalLabel">Confirm</h5>
							<button type="button" class="close" data-dismiss="modal"
								aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div class="modal-body">Are you sure you want to release
							Desk?</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-secondary"
								data-dismiss="modal">Close</button>
							<button type="button" class="btn btn-primary" data-dismiss="modal"
								@click="releaseDesk(employee.desk.bookingId)">Ok</button>
						</div>
	
					</div>
				</div>
			</div>
		</div>
		
		

	`

});


Vue.component("calander",{
	data : function(){
		return {
			today: moment(),
	        dateContext: moment(),
	        days: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
	        loginDate : moment().get('date'),
	        loginYear : moment().format('Y'),
	        loginMonth : moment().format('MMMM'),
	        bookedDates : []
		};
	},
	computed: {
		year: function () {
	        var t = this;
	        return t.dateContext.format('Y');
	    },
	    month: function () {
	        var t = this;
	        return t.dateContext.format('MMMM');
	    },
	    monthNumber: function () {
	        var t = this;
	        return t.dateContext.format('MM');
	    },
		daysInMonth: function () {
	        var t = this;
	        return t.dateContext.daysInMonth();
	    },
	    currentDate: function () {
	        var t = this;
	        return t.dateContext.get('date');
	    },
	    firstDayOfMonth: function () {
	        var t = this;
	        var firstDay = moment(t.dateContext).subtract((t.currentDate - 1), 'days');
	        return firstDay.weekday();
	    },	   
	    initialDate: function () {
	        var t = this;
	        return t.today.get('date');
		},
	    initialMonth: function () {
	        var t = this;
	        return t.today.format('MMMM');
	    },
	    initialYear: function () {
	        var t = this;
	        return t.today.format('Y');
	    }
	},
	created: function(){
		this.$root.startTime = new Date(this.year, this.monthNumber-1, this.currentDate, "00","01","01").getTime();
	    this.$root.endTime =  new Date(this.year, this.monthNumber-1, this.currentDate, "23","59","59").getTime();
	    var _self = this;
	    var url = "/employee/Desk/month/"+this.$root.employee.id+"/"+this.year+"/"+this.monthNumber;
	    fetch(url,{
			method:"GET", 
			headers: {
			    'Content-Type': 'application/json',
			     dataType: "json"
			  }
			}).then(function(response){
				response.json().then(function(data) {
					_self.$root.bookedDates = data;	
					console.log(_self.bookedDates)	       	 			
     	 		});
		});
	},
	methods: {
		
	    addMonth: function () {
	        var t = this;
	        t.dateContext = moment(t.dateContext).add(1, 'month');
	        var _self = this;
		    var url = "/employee/Desk/month/"+this.$root.employee.id+"/"+this.year+"/"+this.monthNumber;
		    fetch(url,{
				method:"GET", 
				headers: {
				    'Content-Type': 'application/json',
				     dataType: "json"
				  }
				}).then(function(response){
					response.json().then(function(data) {
						_self.$root.bookedDates = data;	
						console.log(_self.bookedDates)	       	 			
	     	 		});
			});
	    },
	    subtractMonth: function () {
	        var t = this;
	        t.dateContext = moment(t.dateContext).subtract(1, 'month');
	        var _self = this;
	        var url = "/employee/Desk/month/"+this.$root.employee.id+"/"+this.year+"/"+this.monthNumber;
		    fetch(url,{
				method:"GET", 
				headers: {
				    'Content-Type': 'application/json',
				     dataType: "json"
				  }
				}).then(function(response){
					response.json().then(function(data) {
						_self.$root.bookedDates = data;	
						console.log(_self.bookedDates)	       	 			
	     	 		});
			});
	    },
	    selectDate: function(day){
	    	this.$root.selectedDesk = null;
	    	let root = this.$root;    		
	    	this.dateContext = this.today = moment().year(this.year).month(this.monthNumber-1).date(day);
	    	this.$root.startTime = new Date(this.year, this.monthNumber-1, day, "00","01","01").getTime();
	    	this.$root.endTime =  new Date(this.year, this.monthNumber-1, day, "23","59","59").getTime();
	    	this.$root.selectedDate = moment().year(this.year).month(this.monthNumber-1).date(day);
	    	let param = {
				    		empId : root.employee.id,
				    		startTime : this.$root.startTime,
				    		endTime : this.$root.endTime
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
							root.setDesks(data.desks);	
							// TODO parking		       	 			
		     	 		});
					});
			
	    }
	},
	template:`
	<div class="calendar">
        <div class="calendar-header">
		  <ul>
		    <li class="prev clickable"  @click="subtractMonth">&#10094;</li>
		    <li>
		      {{month + ' - ' + year}}
		    </li>
		    <li class="next clickable" @click="addMonth" >&#10095;</li>
		    
		  </ul>
		</div>
           
        <ul class="weekdays">
            <li v-for="day in days">{{day}}</li>
        </ul>
        <ul class="dates">
            <li v-for="blank in firstDayOfMonth">&nbsp;</li>
            <li v-for="date in daysInMonth">
                <span :class="{'rounded-circle border border-success current-day': date == initialDate && month == initialMonth && year == initialYear, 'Today': date == loginDate && month == loginMonth && year == loginYear, 'BookedDate' : $root.containsDate(date)}" @click="selectDate(date)" class="clickable">{{date}}</span>
           </li>
        </ul>
    </div>
	`
});