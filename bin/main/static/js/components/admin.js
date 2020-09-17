Vue.component("deskupload",{
	data :function(){
		return {
			file : null,
			uploading : false,
			
		};
	},
	
	methods : {
		fileChange:function(event, files){
			this.file = files[0];
			
		    //.then(json =>{ alert(1);console.log(json);})
		    //.catch(err => console.error(err));
		},
		
		upload : function(){
			var _self = this;
			const fd = new FormData();
    		fd.append('file', this.file);
    		fetch('/upload', {
		        method: 'POST',
		        body: fd
		    }).then(function(res){
		    	res.json().then(function(data){
		    		console.log(data);
		    		$('#uploadAlert').modal('show')
		    		_self.$root.refreshDesks();
		    	});
		    })
		}
	},
	
	template:`
		<div>
			<div class="card">
				<div class="card-header">Update desks</div>
				<div class="card-body">
					<div>
						<form enctype="multipart/form-data" novalidate >
							<div class="form-group">
								<input type="file" :disabled="uploading" @change="fileChange($event.target.name, $event.target.files);" accept="xlsx/*" ></input>
							</div>
							<div class="form-group">
								<button type="button" @click="upload()" class="btn btn-success">upload</button>
							</div>
						</form>
					</div>
				</div>
			</div>
			
			<div id="uploadAlert" class="modal fade">
			<div class="modal-dialog modal-confirm">
				<div class="modal-content">
					<div class="modal-header">
						<div class="icon-box">
							<!-- <i class="material-icons">&#xE876;</i>  -->
						</div>
						<h4 class="modal-title w-100">Congrats!</h4>
					</div>
					<div class="modal-body">
						<p class="text-center">Updated desks</p>
					</div>
					<div class="modal-footer">
						<button class="btn btn-success btn-block" data-dismiss="modal">OK</button>
					</div>
				</div>
			</div>
		</div>
			
		</div>
	`
});

Vue.component("config",{
	data : function(){
		return {
			alarming : false,
			coolingOff : 0
		}
	},
	
	created : function() {
		var _self = this;
		fetch("/admin/config",{method:"GET"}).then(function(resp){
			resp.json().then(function(data){
				_self.alarming = data.alarming;
				_self.coolingOff = data.coolingOff;
			});
		});
	},
	methods: {
		apply : function(){
			var _self =  this;
			fetch("/admin/config/update/"+this.alarming+"/"+this.coolingOff,{method:"GET"}).then(function(resp){
				resp.json().then(function(data){
					_self.alarming = data.alarming;
					_self.coolingOff = data.coolingOff;
					$('#applyConfig').modal('show');
					_self.$root.refreshDesks();
				});
			});
		}
	},
	
	template: `
	<div>
		<div class="card">
			<div class="card-header">Configuration</div>
			<div class="card-body">
				<div>
				  <div class="form-group row">
				    <label style="padding-left: 15px;" for="cooling" class="col-form-label">Cooling Off Days: </label>
				    <div style="padding-left:10px" >
				      <select class="custom-select" readonly v-model="coolingOff" id="inputGroupSelect01">
					    <option value="0">0</option>
					    <option disabled value="1">1</option>
					    <option disabled value="2">2</option>
					    <option disabled value="3">3</option>
					  </select>
				    </div>
				  </div>
				  <div class="form-group row">
				    <label style="padding-left: 15px;" for="alarming"  class="col-form-label">Alarming : </label>
				    <div style="padding:9px">
				      <input type="checkbox" v-model="alarming" id="alarming" >
				    </div>
				  </div>
				    <button type="submit" class="btn btn-success" @click="apply()">apply</button>
					  
				</div>
			</div>
		</div>
		
		<div id="applyConfig" class="modal fade">
			<div class="modal-dialog modal-confirm">
				<div class="modal-content">
					<div class="modal-header">
						<div class="icon-box">
							<!-- <i class="material-icons">&#xE876;</i>  -->
						</div>
						<h4 class="modal-title w-100">Congrats!</h4>
					</div>
					<div class="modal-body">
						<p class="text-center">Configuration changes has been applied.</p>
					</div>
					<div class="modal-footer">
						<button class="btn btn-success btn-block" data-dismiss="modal">OK</button>
					</div>
				</div>
			</div>
		</div>
	</div>
	</div>
	`
});

Vue.component("reports",{
	data : function(){
		return {
			from : null,
			to : null,
			empId : null,
			bookings:[]
		};
	},
	created : function(){
		var self = this;
		window.setTimeout(function(){
			$( "#repfromDate" ).datepicker({
					dateFormat: "yy-mm-dd",
					onSelect : function(date){
						self.from = date;
					}
			});
			
			$( "#reptoDate" ).datepicker({
					dateFormat: "yy-mm-dd",
					onSelect : function(date){
						self.to = date;
					}
			});
		},0);
		
	},
	methods : {
		displayDate : function(date){
			return new Date(date).toLocaleDateString();
		},
		getTimeStamp : function(text){
			var nums=  text.split("-")
			return  new Date(Number(nums[0]), Number(nums[1]) - 1, Number(nums[2])).getTime();;
			
		},
		
		eChange : function(){
			let c = this;
			clearTimeout(c.toutId);
			c.toutId = setTimeout(function() {
			    c.getReport();
			},  1000);
		},
		
		getReport : function(){
			var self = this;
			let param = {
	    		empId : this.empId,
	    		startTime : this.getTimeStamp(this.from),
	    		endTime : this.getTimeStamp(this.to)
    		};
			fetch("/report",{
				method:"POST", 
				body : JSON.stringify(param),
				headers: {
				    'Content-Type': 'application/json',
				     dataType: "json"
				  }
				
			}).then(function(resp){
				resp.json().then(function(data){
					self.bookings = data;
				});
			});		
		}
	},
	template: `
	<div class="card">
			<div class="card-header">
				<div class="form-row">
					<div class="col">
				      <span>Reports</span>
				    </div>
				    <div class="col">
				      <input type="text" id="empid" @keyup="eChange()" v-model="empId" class="form-control" placeholder="Employee Id" autocomplete="off">
				    </div>
				    <div class="col">
				      <input type="text" id="repfromDate" v-model="from"  class="form-control" placeholder="From date" autocomplete="off">
				    </div>
				    <div class="col">
				      <input type="text" id="reptoDate" class="form-control" v-model="to" placeholder="To date" autocomplete="off">
				    </div>
				    
				    <button v-if="from && to" class="btn btn-success" @click="getReport()" type="button">Get Report</button>
				  </div>
			</div>
			<div class="card-body">
				<div style="overflow:auto; max-height : 520px">
					<span v-if="bookings.length == 0">No records found</span>
					<table v-if="bookings.length > 0" class="table table-striped">
						<thead>
							<tr>
								<th scope="col">Employee Id</th>
								<th scope="col">Name</th>
								<th scope="col">Department</th>
								<th scope="col">Desk</th>
								<th scope="col">Booked At</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="booking in  bookings">
								<td>{{booking.empId}}</td>
								<td>{{booking.employee.name}}</td>
								<td>{{booking.employee.department}}</td>
								<td>{{booking.deskId}}</td>
								<td >{{displayDate(booking.endTime)}}</td>
								
							</tr>
							
						</tbody>
				</table>	
						
				</div>
			</div>
	</div>
	`
});