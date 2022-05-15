// agregar usurios a un grupo por script
for (i=0; i<user_names.length; i++){
    var user = new GlideRecord('sys_user');
    user.addQuery('user_name',user_names[i]);
    user.query();
    if (user.next()){
        gs.print('Found user: '+user.getValue('name'));
        var group_member = new GlideRecord('sys_user_grmember');
        group_member.setValue('user', user.getValue('sys_id'));
        group_member.setValue('group', 'd16364bc471b01d0c98e6e51e36d43de');
        group_member.insert();
    } else {
        gs.print('Not found user: '+user_names[i]);
    }
}


// Cambiar checks de cambios
var gr = new GlideRecord('change_request');
gr.addEncodedQuery('number=CHG0035978');
gr.query();
gs.print('Found: '+gr.getRowCount());
if (gr.next()){
    gs.print('u_review_audit = '+gr.getValue('u_review_audit'));
    gs.print('u_review_validation = '+gr.getValue('u_review_validation'));
    gr.setValue('u_review_validation',1);
    gr.update();
}


// Borrar los usuarios creados hoy - Ojo con el query por fechas
var gr = new GlideRecord('sys_user');
var myQuery = "sys_created_onBETWEENjavascript:gs.dateGenerate('2020-11-04','00:00:00')@javascript:gs.daysAgoEnd(0)";
gr.addEncodedQuery(myQuery);
gr.query();
gr.deleteMultiple();
gs.print('Recods found: '+gr.getRowCount());

// Borrar todos los file shares
var gr = new GlideRecord('cmdb_ci_storage_fileshare');
gr.query();
gr.deleteMultiple();
gs.print('Recods found: '+gr.getRowCount());

// Quitar los Tren 25 de las ubicaciones de forma masiva.
var gr = new GlideRecord('sys_user');
var myQuery = "location.nameSTARTSWITHtren";
gr.addEncodedQuery(myQuery);
gr.query();
gs.print('Recods found: '+gr.getRowCount());
while (gr.next()){
   gr.setValue('location','');
   gr.update();
}

var gr = new GlideRecord('cmdb_ci');
gr.addEncodedQuery('sys_created_by!=AdminDamm^ORsys_created_by=NULL^sys_created_by!=DOSMLP^ORsys_created_by=NULL^sys_class_name!=cmdb_ci_appl^ORsys_class_name=NULL^sys_class_name=cmdb_ci_spkg');
gr.query();
gr.deleteMultiple();
gs.print(gr.getRowCount());
gr.setWorkflow(false); // Hace que no arranquen las business rules



// Chaning the report Owner
// Reference URL:
//     https://community.servicenow.com/community?id=community_question&sys_id=261ac769db5cdbc01dcaf3231f9619e3
var gr = new GlideRecord('sys_report');
var newUser = '13ce14af1ba6a090d4710b56464bcbe5'; // New user's Sys_id 
var myQuery = "sys_created_bySTARTSWITHdosbm";
gr.addEncodedQuery(myQuery);
gr.query();
while (gr.next()){
   gr.setValue('created_by_user', newUser);
   gs.print('Updating report: '+gr.getValue('title')+' | Table: '+gr.getValue('table'));
   gr.update();
}


// Pasar los CIs de industrial a Inactivos 
var gr = new GlideRecord('cmdb_ci_appl_generic');
//gr.addEncodedQuery('sys_class_name=cmdb_ci_appl_generic^support_group=a4d5bcd3db9fbfc08235ad1748961976');
gr.addEncodedQuery('sys_class_name=cmdb_ci_appl_generic^support_group=a4d5bcd3db9fbfc08235ad1748961976^nameSTARTSWITHDEUTZ');
gr.query();
gs.print(gr.getRowCount());
while (gr.next()) {
    gs.print(gr.getValue('name')+'\n');
    gs.print('Status: '+gr.getValue('install_status')+' | Operational Status: '+gr.getValue('operational_status')+' | Domino Func: '+gr.getValue('u_functional_domain')+'\n');
}


// install_status
//     (o) 1 - Install / Active
//     (o) 7 - Retirado
//     (o) 6 - In stock
//     (o) 3 - In Maintenance
//     (o) 4 - Development
//  operational_status
//     (o) 2 - Operational Keep
//     (o) 5 - Retirado
var gr = new GlideRecord('cmdb_ci_appl_generic');
//gr.addEncodedQuery('sys_class_name=cmdb_ci_appl_generic^support_group=a4d5bcd3db9fbfc08235ad1748961976');
gr.addEncodedQuery('sys_class_name=cmdb_ci_appl_generic^support_group=a4d5bcd3db9fbfc08235ad1748961976^nameSTARTSWITHDEUTZ');
gr.query();
gs.print(gr.getRowCount());
while (gr.next()) {
    gr.setValue('install_status',7);
    gr.setValue('operational_status', 5);
    gr.update();
}


-------------------
Hola,

Esta incidencia estaba pendiente de cambio completado, ha sido pasada a In Progress porque el cambio ya estaba completado. Por favor verificad si se puede cerrar. 
Cualquier pregunta me avisáis.

-------------------
// Resolved status = 6
// In progress status = 2
// On Hold status = 3
// New status = 1
// Close = 7
var gr = new GlideRecord('incident');
gr.addEncodedQuery('numberSTARTSWITHINC0081566');
gr.query();
gs.print(gr.getRowCount()+'\n');
if (gr.next()) {
    gs.print(gr.getValue('number')+'\n');
    gs.print(gr.getValue('state')+' '+gr.getValue('hold_reason')+'\n');
    gr.setValue('state',6);
    gr.setValue('hold_reason', null);
    gr.setWorkflow(false);
    gr.update();
}


// cambio de asignatario a una interacción. Operación no permitida.
var gr = new GlideRecord('interaction');
gr.addEncodedQuery('numberSTARTSWITHIMS0000120');
gr.query();
gs.print(gr.getRowCount()+'\n');
if (gr.next()) {
   gr.setValue('assigned_to', '6d82fc6b1bf4bc107d497bb5464bcb81');
   gr.setWorkflow(false);
   gr.update();
   gs.print("Assigned to: "+gr.getValue('assigned_to'));
} 



// Asignar un una incidencia a un problema
var gr = new GlideRecord('incident');
gr.addEncodedQuery('number=INC0088711');
gr.query();
if (gr.next()) {
    gr.setValue('problem_id','e511fe0c1b562cd07d497bb5464bcbbe');
    gr.update();
}



//-------------------
// Modificación de estados de peticiones
// Delivered status = 10
// Work in progress status = 2
// Closed Complete = 3
// Closed Cancel = 7
// Closed Incomplete = 4
// Pending = 11
 
var gr = new GlideRecord('task');
gr.addEncodedQuery('number=RITM0017622');
gr.query();
gs.print(gr.getRowCount()+'\n');
if (gr.next()) {
    gs.print(gr.getValue('number')+'\n');
    gs.print('State: '+gr.getValue('state')+'\n');
    //gr.setValue('state',10);
    //gr.setWorkflow(false);
    //gr.update();
}

// TC7.3.5.a93bdb1


//sc_task states:
// Open: 1
// Work in progress: 2
// Awaiting development: 6
// Awaiting information -3
// Pending: -5
// DMND0002901

//--------------------------------
// Pasar una tarea de un cambio a open

var gr = new GlideRecord('task');
gr.addEncodedQuery('number=SCTASK0010313');
gr.query();
gs.print(gr.getRowCount());
gr.next();
gs.print('State '+gr.getValue('state'));
gr.setValue('state',1);
gr.update();

var gr = new GlideRecord('task');
gr.addEncodedQuery('number=CTASK0013299');
gr.query();
gs.print(gr.getRowCount());
gr.next();
gs.print('State '+gr.getValue('state')+' order:'+gr.getValue('order'));
gr.setValue('state',1);
gr.setValue('order',100);
gr.update();



//INC0011045

//--------------------------------
// Cambiar de orden una tarea de un cambio
var gr = new GlideRecord('task');
gr.addEncodedQuery('number=CTASK0013013');
gr.query();
gs.print(gr.getRowCount());
gr.next();
gs.print('Order '+gr.getValue('order'));
gr.setValue('order',100);
gr.update();


//--------------------------------
// Eliminar PCs repetidos
var gr = new GlideRecord('cmdb_ci_pc_hardware');
gr.addEncodedQuery('sys_updated_on<'+gs.dateGenerate('2019-12-10','00:00:00')+'^virtual=false');
gr.query();
gs.print(gr.getRowCount());
gr.deleteMultiple();

// change state names:
// Chech the Script Include ChangeRequestStateHandlerSNC
// System Definition > Script includes
// https://dammdev.service-now.com/nav_to.do?uri=%2Fsys_script_include.do%3Fsys_id%3D3112be37cb100200d71cb9c0c24c9c2a%26sysparm_record_target%3Dsys_script_include%26sysparm_record_row%3D4%26sysparm_record_rows%3D4%26sysparm_record_list%3DnameSTARTSWITHChangeRequestStateHandler%255EORDERBYname
// STATE_NAMES: {
//        "-5": ChangeRequestStateHandlerSNC.DRAFT,
//        "-4": ChangeRequestStateHandlerSNC.ASSESS,
//        "-3": ChangeRequestStateHandlerSNC.AUTHORIZE,
//        "-2": ChangeRequestStateHandlerSNC.SCHEDULED,
//        "-1": ChangeRequestStateHandlerSNC.IMPLEMENT,
//        "0": ChangeRequestStateHandlerSNC.REVIEW,
//        "3": ChangeRequestStateHandlerSNC.CLOSED,
//        "4": ChangeRequestStateHandlerSNC.CANCELED

		
var gr = new GlideRecord('change_request');
gr.addEncodedQuery('number=CHG0030682');
gr.query();
gs.print(gr.getRowCount());
gr.next();
gs.print('State '+gr.getValue('state') );
gr.setValue('state', -1);
gr.setValue('close_notes','');
gr.setWorkflow(false);
gr.update();

var grtask = new GlideRecord('change_task');
grtask.addEncodedQuery('number=CTASK0011021');
grtask.query();
grtask.next();
gs.print('State task '+grtask.getValue('state') );
grtask.setValue('state', 1); // 1: in progress
grtask.setWorkflow(false);
grtask.update();


// search a class by sys_id -- Ojo, no funciona
var sysId = "a2847b53eea574101d14f7aabdfd66a7";   //Update your Sys ID
var gr = new GlideRecord('sys_metadata');
gr.addQuery('sys_id',sysId );
gr.addActiveQuery();
gr.query();
gs.log("No of Records matched: "+gr.getRowCount());
while (gr.next()) {
     if (gr.sys_id == sysId ) {
          gs.log(" SYS ID: " + gr.sys_id + " Class Name: " + gr.sys_class_name);
     }
}


// Update all sims information
var cellPhone = new GlideRecord('cmdb_ci_pc_hardware');
cellPhone.addEncodedQuery('u_type=smartphone^u_sim_cardISNOTEMPTY');
cellPhone.query();
gs.print('Recods found: '+cellPhone.getRowCount());
var i=0;
while (cellPhone.next()){
   var sim = cellPhone.getValue('u_sim_card');
   var mobile = cellPhone.sys_id;
   gs.print('SIM for '+mobile +' : '+sim);   
   cellPhone.setValue('u_sim_card','');
   cellPhone.update();
   cellPhone.setValue('u_sim_card',sim);
   cellPhone.update();
}


var query = 'u_type=smartphone^install_status=6^nameNOT LIKE3516^location!=54a4dc3447d701d0c98e6e51e36d43dd^ORlocation=NULL^manufacturer!=587a8fa597eac950fa54ff9fe153af3b^ORmanufacturer=NULL^ORDERBYDESCsys_created_on';
var smartphone = new GlideRecord('cmdb_ci_pc_hardware');
smartphone.addEncodedQuery(query);
smartphone.query();
while (smartphone.next()) {
    var imei = smartphone.getValue('u_imei');
    //gs.print('Found: '+imei);
    smartphone.setValue('u_imei', '');
    smartphone.update();
    smartphone.setValue('u_imei', imei);
    smartphone.update();
}




// Issue correction on telephony services
var issues = [
 ['699238170', '350019151820186'], 
 ['600931897', '350019151818610'], 
 ['699362926', '350019151642622'] ];
    
for (i=0;i<issues.length;i++){
    var sim = new GlideRecord('cmdb_ci_sim_card');
    sim.addQuery('mobile_number', issues[i][0]);
    sim.query();
    if (!sim.next()){
        gs.print('ERROR: Sim card: '+issues[i][0]+' not found');
        continue;
    }
    var user = new GlideRecord('sys_user');
    user.addQuery('sys_id', sim.getValue('assigned_to'));
    user.query();
    var user_name = '';
    if (user.next()){
        user_name = user.getValue('name');
    } else {
        gs.print('WARNING: Mobile number '+issues[i][0]+' not assigned to a user');
    }

	var smartphone = new GlideRecord('cmdb_ci_pc_hardware');
    smartphone.addQuery('u_imei', issues[i][1]);
    smartphone.query();
    if (! smartphone.next()){
        gs.print('ERROR: Smartphone: '+issues[i][1]+' not found');
        continue;
    }
    sim.setValue('u_hardware', smartphone.getUniqueValue());
    gs.print('Updating: '+sim.getValue('name')+' | for user: '+user_name+' | with hardware: '+smartphone.getValue('name'));
    sim.update();
}



// Adding users to a ServiceNow Group - d16364bc471b01d0c98e6e51e36d43de
var user_names = ['MORAPR', 
'DOSCPM', 
'FONMSB', 
'GESJFM']

for (i=0; i<user_names.length; i++){
    var user = new GlideRecord('sys_user');
    user.addQuery('user_name',user_names[i]);
    user.query();
    if (user.next()){
        gs.print('Found user: '+user.getValue('name'));
        var group_member = new GlideRecord('sys_user_grmember');
        group_member.setValue('user', user.getValue('sys_id'));
        group_member.setValue('group', 'd16364bc471b01d0c98e6e51e36d43de');
        group_member.insert();
    } else {
        gs.print('Not found user: '+user_names[i]);
    }
    

}
