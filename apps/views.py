from django.shortcuts import render
from django.views.generic import View
from apps.models import CommonUser

# Create your views here.
class InfoView(View):
    """数据信息"""

    def get(self, request):
        """主页面"""
        user = CommonUser.objects.get(id=1)
        name = user.name
        print(user, name)
        return render(request, "index.html", {"data": name})
