angular.module('app').controller('homeCtrl', function($scope){
    $scope.data={};
    $scope.data.office=[{
        name:'Microsoft Office Word 2016',
        icon:'icon-word'
    },{
        name:'Microsoft Office Excel 2016',
        icon:'icon-excel'
    },{
        name:'Microsoft Office PowerPoint 2016',
        icon:'icon-powerpoint'
    },{
        name:'Microsoft Office Access 2016',
        icon:'icon-access'
    },{
        name:'Microsoft Office OneNote 2016',
        icon:'icon-onenote'
    },{
        name:'Microsoft Office Outlook 2016',
        icon:'icon-outlook'
    },{
        name:'Microsoft Office Publisher 2016',
        icon:'icon-publisher'
    }];
    alert()
});