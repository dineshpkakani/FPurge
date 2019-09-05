
(function(){
    var duplicateFileFinderApp =  angular.module('duplicateFileFinder',['ui.bootstrap']);

    duplicateFileFinderApp.controller('duplicateFileFinderCtrl',['$http','$modal',duplicateFileFinderCtrl]);
    function duplicateFileFinderCtrl($http,$modal){
        var fileFinderCtrl = this;

        Object.assign(fileFinderCtrl,{
            jQuerydata:[],
            onLoad : function(){
                fileFinderCtrl.noofrecords=0;
                parent.document.getElementById("divjquerypurge").style.display="";
            },
            sendRequest : function(type, url, formData) {
                $("#lookupLoader").addClass("show");
                return $http({
                    headers: {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"},
                    method: type,
                    url: url,
                    data: $.param(formData),
                    cache: false
                });
            },
            filterData:function(isExcel){
                var strBeginsWith=$.trim(fileFinderCtrl.ngbegingswith);
                var strInBetween=$.trim(fileFinderCtrl.ngtxtinbetween);
                var strEndsWith=$.trim(fileFinderCtrl.ngtxtendswith);

                if(( strBeginsWith== "" || strBeginsWith==undefined)&&( strInBetween== "" || strInBetween==undefined)&&( strEndsWith== "" || strEndsWith==undefined)){
                    fileFinderCtrl.FileFinderMsg('Please select Begins With/Ends With/In between');
                    return false;
                }
                var strfiletype=$.trim(fileFinderCtrl.ngslctfiletype);
                if(( strfiletype== "" || strfiletype==undefined)){
                    fileFinderCtrl.FileFinderMsg('Please select File type');
                    return false;
                }
                var strGroupingType=$.trim(fileFinderCtrl.ngslctgrouptype);

                if(( strGroupingType== "" || strGroupingType==undefined)){
                    fileFinderCtrl.FileFinderMsg('Please select Grouping type');
                    return false;
                }
                var param={
                    beginsWith:strBeginsWith,
                    inBetween:strInBetween,
                    endsWith:strEndsWith+strfiletype,
                    groupingType:strGroupingType,
                    exportToExcel:isExcel
                };
                if(isExcel==1){
                    fileFinderCtrl.nbegin=strBeginsWith;
                    fileFinderCtrl.ninbetween=strInBetween;
                    fileFinderCtrl.nendswith=strEndsWith+strfiletype;
                    fileFinderCtrl.ngrouping=strGroupingType;
                    fileFinderCtrl.nexport=isExcel;
                    document.forms["frmexcel"].beginsWith.value=strBeginsWith;
                    document.forms["frmexcel"].inBetween.value=strInBetween;
                    document.forms["frmexcel"].endsWith.value=strEndsWith+strfiletype;
                    document.forms["frmexcel"].groupingType.value=strGroupingType;
                    document.forms["frmexcel"].exportToExcel.value=isExcel;

                    document.getElementById("frmexcel").submit();
                }else {
                    var url = '/mobiledoc/dental/FilePurging/getData';
                    this.sendRequest("POST", url, param).then(function (response) {
                        $("#lookupLoader").removeClass("show");
                        fileFinderCtrl.jQuerydata = response.data.data;
                     //   fileFinderCtrl.noofrecords = response.data.totalRecords;
                        parent.document.getElementById("jquerypageCount").innerHTML=response.data.totalRecords;
                        //fileFinderCtrl.FileFinderMsg(response);
                    });
                }
            },
            FileFinderMsg:function(strMsg){
                ecwAlert(strMsg, "eClinicalWorks", "", "", "orangetheme");
            },
            deleteShowPopup:function(){
                $('#deleteFileModal').modal('show');
            },
            closeDeletePopup:function(){
                $('#deleteFileModal').modal('hide');
            },
            openSettings:function () {

                var strURL="/mobiledoc/jsp/webemr/webpm/fileRemoveUtils/configurePath.html?param=1";
                /*
                strURL = strURL + "?sessionDID=" + global.sessionDID;
                strURL = strURL + "&TrUserId=" + global.TrUserId;
                strURL = strURL + "&Device=webemr";
                strURL = strURL + "&ecwappprocessid=" + global.ecwappprocessid;
                 */
                strURL = strURL + "&rnd2=" + Math.random();
                strURL = strURL + "&timestamp=" + new Date().getTime();

                let modalInstance = $modal.open({
                    templateUrl : strURL,
                    controller: function ($http,$modalInstance){
                        let cnfgCtrl = this;
                        cnfgCtrl.tab=1;
                        cnfgCtrl.closeModal = function(){
                            $modalInstance.dismiss();
                        },
                        cnfgCtrl.selectJqueryFolder=function ($event) {
                            console.log($event);
                        },
                        cnfgCtrl.sendRequest = function(type, url, formData) {
                            $("#lookupLoader").addClass("show");
                            return $http({
                                headers: {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"},
                                method: type,
                                url: url,
                                data: $.param(formData),
                                cache: false
                            });
                        },
                        cnfgCtrl.jqueryConfigure=function () {
                            var jqueryURL=$.trim(cnfgCtrl.jqueryURL);
                            if( jqueryURL== "" || jqueryURL==undefined){
                                fileFinderCtrl.FileFinderMsg('Please select mobiledoc path.');
                                return false;
                            }
                            var jqueryFileType=$.trim(cnfgCtrl.jqueryfiletype);
                            if( jqueryFileType== "" || jqueryFileType==undefined){
                                fileFinderCtrl.FileFinderMsg('Please select File Type.');
                                return false;
                            }
                            var param={
                                    filePath:jqueryURL,
                                    fileType:jqueryFileType
                            };
                            var url = '/mobiledoc/dental/FilePurging/setDirectory';

                                this.sendRequest("POST",url,param).then(function (response){
                                    $("#lookupLoader").removeClass("show");
                                    fileFinderCtrl.FileFinderMsg($.trim(response.data));

                            },function (error){

                            });

                        }                            
                    },
                    controllerAs:'cnfgCtrl',
                    resolve : {
                        requestObj : function() {
                          //  return $scope.osRequestJson;
                        }
                    },
                    windowClass : 'modal fade orangetheme w720 in',
                    backdrop : "static"
                });

                modalInstance.result.then(function(staff) {
                    if (staff.type == 'OK' && staff.name != '') {
                        //$scope.setStaffData(staff)
                    }
                });


            }
        });
        fileFinderCtrl.onLoad();
    };
})();

var ecwAlert = function(msg, title, okCallbBack, btnLbl, theme, elementId, hascloseButton) {
    var isCallFromEva = sessionStorage.getItem("callFromEva");
    if(isCallFromEva==true || isCallFromEva=="true"){
        showhideMessage(msg,true);
    }else{
        if (angular.isUndefined(title) || $.trim(title).length == 0) {
            title = "eClinicalWorks";
        }
        if (angular.isUndefined(btnLbl) || $.trim(btnLbl).length == 0) {
            btnLbl = "OK";
        }
        if (angular.isUndefined(hascloseButton) || $.trim(hascloseButton).length == 0) {
            hascloseButton = true;
        }
        var oMsg = bootbox.dialog({
            message: msg,
            title: title,
            closeButton: hascloseButton,
            buttons: {
                Yes: {
                    label: btnLbl,
                    callback: function() {
                        if ($.trim(okCallbBack) != "") {
                            setTimeout(okCallbBack, 0);
                            closeModal();
                            return;
                        }
                        if (!angular.isUndefined(elementId) && $.trim(elementId).length > 0) {
                            setTimeout(function() {
                                $('#' + elementId).focus();
                            }, 100);
                        }
                        return;
                    }
                }
            }
        });
        setTimeout(function(){
            $(oMsg).find('button[data-bb-handler=Yes]').focus();
        },500);
        if (!angular.isUndefined(theme) && $.trim(theme).length > 0) {
            oMsg.removeClass("orangetheme").addClass(theme);
        }
    }
};