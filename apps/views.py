from django.shortcuts import HttpResponse, render
from django.views.generic import View
from apps.function.MovieCenter.GetMovieInfo import GetMovieInfo
from apps.getMovie.get_movie import run


# Create your views here.
class MovieView(View):
    """数据信息"""

    def get(self, request):
        """主页面"""
        current_page = request.GET.get("page", 1)
        data = GetMovieInfo(current_page=current_page, rows=1).deal_data()
        movie_info_list = data.get("data")
        total_page = data.get("total_page")
        previous = data.get("previous")
        next_page = data.get("next_page")
        return render(request, 'index.html',
                      {"data": movie_info_list, "total_page": total_page, "current_page": current_page,
                       "next_page": next_page, "previous": previous})


def start_spider():
    run()
    print("sdadadad")
    return HttpResponse("start")
